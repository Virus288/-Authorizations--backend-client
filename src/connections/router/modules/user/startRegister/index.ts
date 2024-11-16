import StartRegisterDto from '../../../../../modules/users/subModules/startRegister/dto.js';
import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type { IStartRegisterReq } from './types.js';
import type ClientsRepository from '../../../../../modules/clients/repository/index.js';

export default class UserRouter extends AbstractRouter<string, StartRegisterDto, ClientsRepository> {
  override async execute(req: IStartRegisterReq): Promise<string> {
    const dto = new StartRegisterDto(req.query);

    return this.controller.execute(dto, req);
  }
}
