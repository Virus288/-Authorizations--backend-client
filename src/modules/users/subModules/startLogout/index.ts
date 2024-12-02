import { ETokens } from '../../../../enums/index.js';
import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import TokenController from '../../../tokens/index.js';
import type StartLogoutDto from './dto.js';
import type { IUserSession } from '../../../../types/index.js';
import type express from 'express';

export default class LogoutController extends AbstractController<StartLogoutDto, string, null, express.Request> {
  override async execute(dto: StartLogoutDto, req: express.Request): Promise<string> {
    const cookie = (req.cookies as Record<string, string>)[ETokens.Access];
    if (!cookie) throw new InvalidRequest();

    const tokenData = await TokenController.validateToken(cookie);
    const tokenController = new TokenController(tokenData.sub);

    (req.session as IUserSession).logout = true;
    (req.session as IUserSession).client = dto.client;
    (req.session as IUserSession).userId = tokenData.sub;

    return tokenController.logoutOidc();
  }
}
