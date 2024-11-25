import jose from 'node-jose';
import Log from 'simpleLogger';
import UserModel from '../../../../connections/mongo/models/user.js';
import { ETokens } from '../../../../enums/tokens.js';
import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import TokenController from '../../../tokens/index.js';
import UsersRepository from '../../repository/index.js';
import type { ITokenData, IIntrospection } from '../../../../types/index.js';
import type express from 'express';

export default class ValidateTokenController extends AbstractController<
  null,
  { login: string; tokenTTL: string; realTokenTTL: string },
  null
> {
  override async execute(
    _data: null,
    req: express.Request,
  ): Promise<{ login: string; tokenTTL: string; realTokenTTL: string }> {
    const cookie = (req.cookies as Record<string, string>)[ETokens.Access];
    Log.debug('Verify', `User token ${cookie}`);
    if (!cookie) throw new InvalidRequest();

    const key = await TokenController.getKey(cookie);

    const result = await jose.JWS.createVerify(key).verify(cookie);
    const parsed = JSON.parse(result.payload.toString()) as ITokenData;

    if (new Date(parsed.exp * 1000).getTime() - Date.now() < 0) {
      Log.debug('Verify', 'Token expired');
      throw new InvalidRequest();
    }

    const user = await new UsersRepository(UserModel).get(parsed.sub);

    const tokenController = new TokenController(parsed.sub);

    const userTokens = await tokenController.getTokens();
    let refreshTokenData: IIntrospection | null = null;

    if (userTokens) {
      // Token for connecting oidc server is dead, but user's session is still active. If you do not like this, modify below function
      refreshTokenData = await tokenController.checkRefreshToken(userTokens?.refreshToken);
    }

    return {
      login: user!.login,
      tokenTTL: new Date(parsed.exp * 1000).toString(),
      realTokenTTL: refreshTokenData ? new Date(refreshTokenData.exp * 1000).toString() : 'Dead',
    };
  }
}
