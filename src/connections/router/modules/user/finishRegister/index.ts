import FinishRegisterDto from '../../../../../modules/users/subModules/finishRegister/dto.js';
import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type { IFinishRegisterReq } from './types.js';
import type UsersRepository from '../../../../../modules/users/repository/index.js';

export default class UserRouter extends AbstractRouter<string, FinishRegisterDto, UsersRepository> {
  override async execute(req: IFinishRegisterReq): Promise<string> {
    const dto = new FinishRegisterDto(req.query);

    return this.controller.execute(dto, req);
  }
}
