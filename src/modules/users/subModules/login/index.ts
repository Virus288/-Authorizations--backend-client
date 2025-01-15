import jose from 'node-jose';
import Log from 'simpl-loggar';
import OidcClientModel from '../../../../connections/mongo/models/oidcClient.js';
import UserModel from '../../../../connections/mongo/models/user.js';
import { EClientGrants } from '../../../../enums/index.js';
import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import getConfig from '../../../../tools/configLoader.js';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from '../../../../tools/crypt.js';
import { generateRandomName } from '../../../../utils/index.js';
import OidcClientRepo from '../../../oidcClients/repository/index.js';
import TokenController from '../../../tokens/index.js';
import UsersRepository from '../../repository/index.js';
import type LoginDto from './dto.js';
import type { IUserSession, IUserServerTokens } from '../../../../types/index.js';
import type ClientsRepository from '../../../clients/repository/index.js';
import type express from 'express';
import type mongoose from 'mongoose';

export default class LoginController extends AbstractController<
  LoginDto,
  { url: string; accessToken: string; refreshToken: string } | string,
  ClientsRepository,
  express.Request
> {
  override async execute(
    data: LoginDto,
    req: express.Request,
  ): Promise<{ url: string; accessToken: string; refreshToken: string; sessionToken: string } | string> {
    if (data.code) {
      const { userId, tokenController, refreshToken } = await this.login(data, req);
      return this.createTokens(userId, tokenController, req, refreshToken);
    }

    return this.sendToLoginPage(data, req);
  }

  private async sendToLoginPage(data: LoginDto, req: express.Request): Promise<string> {
    const client = await this.repository.getByName(data.client!);
    if (!client) throw new InvalidRequest();

    const timestamp = Math.floor(Date.now() / 1000);
    const randomValue = generateRandomName(30);
    const nonce = `${timestamp}|${randomValue}`;

    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallengeFromVerifier(verifier);

    (req.session as IUserSession).nonce = nonce;
    (req.session as IUserSession).client = client.clientId;
    (req.session as IUserSession).verifier = verifier;

    const oidcClientRepo = new OidcClientRepo(OidcClientModel);
    const oidcClient = await oidcClientRepo.getByGrant(EClientGrants.AuthorizationCode);

    const params = new URLSearchParams({
      client_id: oidcClient!.clientId,
      redirect_uri: `${getConfig().myAddress}/user/login`,
      nonce,
      response_type: 'code',
      scope: 'openid',
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    return `${getConfig().authorizationAddress}/auth?${params.toString()}`;
  }

  private async createTokens(
    userId: string,
    tokenController: TokenController,
    req: express.Request,
    refreshToken: string,
  ): Promise<{ url: string; refreshToken: string; accessToken: string; sessionToken: string }> {
    const userRepo = new UsersRepository(UserModel);

    const userData = await userRepo.getByUserId(userId);
    if (!userData) {
      Log.error('Login', 'User logged in, but there is no data related to him. Error ?');
      throw new InvalidRequest();
    }

    const newRefreshToken = await tokenController.createRefreshToken(userData);
    const accessToken = await tokenController.createAccessToken(userData);
    const sessionToken = await tokenController.createSessionToken(userData, refreshToken, req.ip!);
    const url = await this.createUrl(req);
    return { refreshToken: newRefreshToken, accessToken, sessionToken, url };
  }

  private async login(
    data: LoginDto,
    req: express.Request,
  ): Promise<{ userId: string; tokenController: TokenController; refreshToken: string }> {
    const oidcClientRepo = new OidcClientRepo(OidcClientModel);
    const verifier = (req.session as IUserSession).verifier!;

    delete (req.session as IUserSession).verifier;
    delete (req.session as IUserSession).nonce;

    // Get one client - this should probably include some custom logic
    const oidcClient = await oidcClientRepo.getByGrant(EClientGrants.AuthorizationCode);

    Log.debug('Login', 'Oidc client to use', oidcClient);

    if (!oidcClient) throw new InvalidRequest();

    const body = new URLSearchParams({
      client_id: oidcClient.clientId,
      client_secret: oidcClient.clientSecret,
      code: data.code!,
      grant_type: oidcClient.clientGrant,
      redirect_uri: oidcClient.redirectUri,
      code_verifier: verifier,
    });

    Log.debug('Login', 'Sending token req', body.toString());
    const res = await fetch(`${getConfig().authorizationAddress}/token`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': 'http://localhost:5004',
      },
    });

    if (res.ok) {
      return this.saveToken((await res.json()) as IUserServerTokens);
    }

    const err = await res.json();
    Log.error('Login', 'Got error from server', err);
    throw new InvalidRequest();
  }

  private async saveToken(
    tokens: IUserServerTokens,
  ): Promise<{ userId: string; tokenController: TokenController; refreshToken: string }> {
    const userId = await this.decodeIdToken(tokens.id_token);
    const userRepo = new UsersRepository(UserModel);

    const userData = await userRepo.getByUserId(userId);
    if (!userData) {
      Log.error('Login', 'User logged in, but there is no data related to him. Error ?');
      throw new InvalidRequest();
    }

    const tokenController = new TokenController((userData._id as mongoose.Types.ObjectId).toString());

    await tokenController.addToken(tokens);

    return { userId, tokenController, refreshToken: tokens.refresh_token };
  }

  private async fetchCerts(): Promise<jose.JWK.KeyStore> {
    const res = await fetch(`${getConfig().authorizationAddress}/certs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5004',
      },
    });

    if (res.ok) {
      const keys = (await res.json()) as { keys: jose.JWK.Key[] };
      return jose.JWK.asKeyStore(keys);
    }

    const err = await res.json();
    Log.error('Login', 'Got error while fetching certs', err);
    throw new InvalidRequest();
  }

  private async decodeIdToken(idToken: string): Promise<string> {
    const keystore = await this.fetchCerts();

    const parts = idToken.split('.');
    const header = JSON.parse(Buffer.from(parts[0]!, 'base64').toString('utf8')) as {
      alg: string;
      typ: string;
      kid: string;
    };

    const key = keystore.get(header.kid);

    if (!key) {
      Log.error('Login', 'Key not found in keystore. Possibly token expired, or tokens got rotated');
      throw new InvalidRequest();
    }

    const result = await jose.JWS.createVerify(key).verify(idToken);
    const parsed = JSON.parse(result.payload.toString()) as { sub: string; login: string };
    Log.debug('Login', `Decoded id token for ${parsed.login}`);

    return parsed.sub;
  }

  private async createUrl(req: express.Request): Promise<string> {
    const client = await this.repository.getByName((req.session as IUserSession).client!);
    delete (req.session as IUserSession).client;

    return client!.redirectUri;
  }
}
