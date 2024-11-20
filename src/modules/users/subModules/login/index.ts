import jose from 'node-jose';
import Log from 'simpleLogger';
import KeyModel from '../../../../connections/mongo/models/keys.js';
import TokenModel from '../../../../connections/mongo/models/token.js';
import UserModel from '../../../../connections/mongo/models/user.js';
import { InternalError, InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import getConfig from '../../../../tools/configLoader.js';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from '../../../../tools/crypt.js';
import { generateRandomName } from '../../../../utils/index.js';
import KeysRepository from '../../../keys/repository/index.js';
import AddToken from '../../../tokens/repository/add.js';
import TokenRepository from '../../../tokens/repository/index.js';
import UsersRepository from '../../repository/index.js';
import type LoginDto from './dto.js';
import type { IUserSession } from '../../../../types/requests.js';
import type { IUserServerTokens } from '../../../../types/user.js';
import type ClientsRepository from '../../../clients/repository/index.js';
import type express from 'express';

export default class LoginController extends AbstractController<
  LoginDto,
  { url: string; cookie: string } | string,
  ClientsRepository,
  express.Request
> {
  override async execute(data: LoginDto, req: express.Request): Promise<{ url: string; cookie: string } | string> {
    if (data.code) return this.login(data, req);
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

    const params = new URLSearchParams({
      client_id: 'oidcClient',
      redirect_uri: `${getConfig().myAddress}/user/login`,
      nonce,
      response_type: 'code',
      scope: 'openid',
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    return `${getConfig().authorizationAddress}/auth?${params.toString()}`;
  }

  private async login(data: LoginDto, req: express.Request): Promise<{ url: string; cookie: string }> {
    const verifier = (req.session as IUserSession).verifier!;

    delete (req.session as IUserSession).verifier;
    delete (req.session as IUserSession).nonce;

    const body = new URLSearchParams({
      client_id: 'oidcClient',
      client_secret: '4uqMOFQ97b',
      code: data.code!,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:5004/user/login',
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
      const userId = await this.saveToken((await res.json()) as IUserServerTokens);
      return this.createToken(userId, req);
    }

    const err = await res.json();
    Log.error('Login', 'Got error from server', err);
    throw new InvalidRequest();
  }

  private async saveToken(tokens: IUserServerTokens): Promise<string> {
    const repo = new TokenRepository(TokenModel);

    const userId = await this.decodeIdToken(tokens.id_token);

    const newToken = new AddToken({
      ttl: tokens.expires_in.toString(),
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      userId,
    });
    await repo.add(newToken);

    return userId;
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

  private async createToken(userId: string, req: express.Request): Promise<{ url: string; cookie: string }> {
    const repo = new KeysRepository(KeyModel);
    const userRepo = new UsersRepository(UserModel);

    const keys = await repo.getAll();
    if (keys.length === 0) {
      Log.error('Login', 'Missing keys!');
      throw new InternalError();
    }

    const keystore = await jose.JWK.asKeyStore({ keys });
    const key = keystore.get(keys[0]!.kid);

    const userData = await userRepo.getByUserId(userId);
    if (!userData) {
      Log.error('Login', 'User logged in, but there is no data related to him. Error ?');
      throw new InvalidRequest();
    }

    const payload = {
      sub: userData._id,
      iat: Math.floor(Date.now() / 1000),
    };

    const signer = jose.JWS.createSign({ format: 'compact', fields: { alg: 'RS256', kid: key.kid } }, key);

    const jwt = await signer.update(JSON.stringify(payload)).final();
    const client = await this.repository.getByName((req.session as IUserSession).client!);
    delete (req.session as IUserSession).client;

    // #TODO Interface for jwt seems to be incorrect
    return { cookie: jwt as unknown as string, url: client!.redirectUri };
  }
}
