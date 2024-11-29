import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type ClientsRepository from '../../../../../modules/clients/repository/index.js';
import type express from 'express';

export default class UserRouter extends AbstractRouter<string, express.Request, ClientsRepository> {
  override async execute(req: express.Request): Promise<string> {
    return this.controller.execute(req);
  }
}
