import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import TokensController from '../../../tokens/index.js';
import type { IUserSession } from '../../../../types/requests.js';
import type ClientsRepository from '../../../clients/repository/index.js';
import type express from 'express';

export default class LogoutController extends AbstractController<express.Request, string, ClientsRepository> {
  override async execute(req: express.Request): Promise<string> {
    const { client } = req.session as IUserSession;
    if (!(req.session as IUserSession).logout || !(req.session as IUserSession).userId || !client) {
      throw new InvalidRequest();
    }

    const clientData = await this.repository.getByName(client);
    if (!clientData) throw new InvalidRequest();

    const tokenController = new TokensController((req.session as IUserSession).userId!);
    await tokenController.logout();
    await tokenController.removeUserTokens();

    delete (req.session as IUserSession).logout;
    delete (req.session as IUserSession).client;
    delete (req.session as IUserSession).userId;

    return clientData.redirectUri;
  }
}
