import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type UsersRepository from '../../../../../modules/users/repository/index.js';
import type express from 'express';

export default class UserRouter extends AbstractRouter<
  { sessionToken: string | undefined; refreshToken: string; accessToken: string } | string,
  null,
  UsersRepository
> {
  override async execute(
    req: express.Request,
  ): Promise<{ sessionToken: string | undefined; refreshToken: string; accessToken: string } | string> {
    return this.controller.execute(null, req);
  }
}
