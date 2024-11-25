import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type express from 'express';

export default class UserRouter extends AbstractRouter<
  { login: string; tokenTTL: string; realTokenTTL: string },
  null,
  null
> {
  override async execute(req: express.Request): Promise<{ login: string; tokenTTL: string; realTokenTTL: string }> {
    return this.controller.execute(null, req);
  }
}
