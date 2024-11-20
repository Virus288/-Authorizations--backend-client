import LoginDto from '../../../../../modules/users/subModules/login/dto.js';
import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type { ILoginReq } from './types.js';
import type ClientsRepository from '../../../../../modules/clients/repository/index.js';

export default class UserRouter extends AbstractRouter<
  string | { cookie: string; url: string },
  LoginDto,
  ClientsRepository
> {
  override async execute(req: ILoginReq): Promise<{ url: string; cookie: string } | string> {
    const dto = new LoginDto(req.query);

    return this.controller.execute(dto, req);
  }
}
