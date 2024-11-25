import jose from 'node-jose';
import Log from 'simpleLogger';
import AddToken from './repository/add.js';
import TokenRepository from './repository/index.js';
import KeyModel from '../../connections/mongo/models/keys.js';
import TokenModel from '../../connections/mongo/models/token.js';
import { ETTL } from '../../enums/index.js';
import { InternalError, InvalidRequest } from '../../errors/index.js';
import getConfig from '../../tools/configLoader.js';
import KeyRepository from '../keys/repository/index.js';
import type { IIntrospection, ITokenData, ITokenEntity, IUserEntity, IUserServerTokens } from '../../types/index.js';

export default class TokensController {
  private readonly _userId: string;
  private readonly _repo: TokenRepository;

  constructor(userId: string) {
    this._userId = userId;
    this._repo = new TokenRepository(TokenModel);
  }

  private get userId(): string {
    return this._userId;
  }

  private get repo(): TokenRepository {
    return this._repo;
  }

  static async getKey(cookie: string): Promise<jose.JWK.Key> {
    const repo = new KeyRepository(KeyModel);
    const keys = await repo.getAll();
    const keystore = await jose.JWK.asKeyStore({ keys });

    const parts = cookie.split('.');
    const header = JSON.parse(Buffer.from(parts[0]!, 'base64').toString('utf8')) as {
      alg: string;
      typ: string;
      kid: string;
    };

    const key = keystore.get(header?.kid);
    if (!key) {
      Log.error('Verify', 'Key not found in keystore. Possibly token expired, or tokens got rotated');
      throw new InvalidRequest();
    }

    return key;
  }

  private async getSigningKey(): Promise<jose.JWK.Key> {
    const repo = new KeyRepository(KeyModel);
    const keys = await repo.getAll();

    if (keys.length === 0) {
      Log.error('Tokens controller', 'Missing keys!');
      throw new InternalError();
    }

    const keystore = await jose.JWK.asKeyStore({ keys });
    return keystore.get(keys[0]!.kid);
  }

  getTokens(): Promise<ITokenEntity | null> {
    return this.repo.getByUserId(this.userId);
  }

  async addToken(tokens: IUserServerTokens): Promise<void> {
    const newToken = new AddToken({
      ttl: tokens.expires_in.toString(),
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      userId: this.userId,
    });
    await this.repo.add(newToken);
  }

  async removeUserTokens(): Promise<void> {
    const repo = new TokenRepository(TokenModel);
    await repo.removeByUserId(this.userId);
  }

  async checkRefreshToken(refreshToken: string): Promise<IIntrospection | null> {
    const body = new URLSearchParams({
      client_id: 'oidcClient',
      client_secret: '4uqMOFQ97b',
      token: refreshToken,
    });

    const res = await fetch(`${getConfig().authorizationAddress}/token/introspection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': getConfig().myAddress,
      },
      body,
    });

    if (!res.ok) {
      Log.debug('Check refreshToken', 'Refresh token expired');
      await this.removeUserTokens();
      return null;
    }

    Log.debug('Check refreshToken', 'Refresh token is still active');
    return (await res.json()) as IIntrospection;
  }

  async createAccessToken(userData: IUserEntity): Promise<string> {
    const payload: ITokenData = {
      sub: userData._id as string,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + ETTL.UserAccessToken * 1000) / 1000),
    };

    const key = await this.getSigningKey();
    const signer = jose.JWS.createSign({ format: 'compact', fields: { alg: 'RS256', kid: key.kid } }, key);

    // #TODO Interface for jwt seems to be incorrect
    return signer.update(JSON.stringify(payload)).final() as unknown as Promise<string>;
  }

  async createRefreshToken(userData: IUserEntity): Promise<string> {
    const payload: ITokenData = {
      sub: userData._id as string,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + ETTL.UserRefreshToken * 1000) / 1000),
    };

    const key = await this.getSigningKey();
    const signer = jose.JWS.createSign({ format: 'compact', fields: { alg: 'RS256', kid: key.kid } }, key);

    // #TODO Interface for jwt seems to be incorrect
    return signer.update(JSON.stringify(payload)).final() as unknown as Promise<string>;
  }
}
