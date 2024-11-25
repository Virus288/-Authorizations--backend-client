import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type express from 'express';

export default class UserRouter extends AbstractRouter<string, null, null> {
  override async execute(req: express.Request): Promise<string> {
    return this.controller.execute(null, req);
  }
}
