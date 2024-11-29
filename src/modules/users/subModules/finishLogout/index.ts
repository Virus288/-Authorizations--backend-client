import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import type { IUserSession } from '../../../../types/requests.js';
import type ClientsRepository from '../../../clients/repository/index.js';
import type express from 'express';

export default class LogoutController extends AbstractController<express.Request, string, ClientsRepository> {
  override async execute(req: express.Request): Promise<string> {
    const { client } = req.session as IUserSession;
    if (!(req.session as IUserSession).logout || !client) throw new InvalidRequest();

    const clientData = await this.repository.getByName(client);
    if (!clientData) throw new InvalidRequest();

    delete (req.session as IUserSession).logout;
    delete (req.session as IUserSession).client;

    return clientData.redirectUri;
  }
}
