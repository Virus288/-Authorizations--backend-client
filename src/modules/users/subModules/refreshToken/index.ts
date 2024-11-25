import jose from 'node-jose';
import Log from 'simpleLogger';
import UserModel from '../../../../connections/mongo/models/user.js';
import { ETokens } from '../../../../enums/tokens.js';
import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import TokenController from '../../../tokens/index.js';
import UsersRepository from '../../repository/index.js';
import type { IUserEntity, ITokenData } from '../../../../types/index.js';
import type express from 'express';

export default class RefreshTokenController extends AbstractController<null, string, null> {
  private async getUserData(userId: string): Promise<IUserEntity> {
    const userRepo = new UsersRepository(UserModel);

    const userData = await userRepo.get(userId);
    if (!userData) {
      Log.error('Login', 'User logged in, but there is no data related to him. Error ?');
      throw new InvalidRequest();
    }

    return userData;
  }

  override async execute(_data: null, req: express.Request): Promise<string> {
    const cookie = (req.cookies as Record<string, string>)[ETokens.Refresh];
    Log.debug('Refresh', `User token ${cookie}`);
    if (!cookie) throw new InvalidRequest();

    const key = await TokenController.getKey(cookie);

    const result = await jose.JWS.createVerify(key).verify(cookie);
    const parsed = JSON.parse(result.payload.toString()) as ITokenData;

    if (new Date(parsed.exp * 1000).getTime() - Date.now() < 0) {
      Log.debug('Refresh', 'Token expired');
      throw new InvalidRequest();
    }
    const tokenController = new TokenController(parsed.sub);

    const userData = await this.getUserData(parsed.sub);
    const accessToken = await tokenController.createAccessToken(userData);

    return accessToken;
  }
}
