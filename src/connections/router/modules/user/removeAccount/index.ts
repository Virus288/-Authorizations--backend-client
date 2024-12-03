import RemoveAccountDto from '../../../../../modules/users/subModules/removeAccount/dto.js';
import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type { IRemoveAccountReq } from './types.js';
import type ClientsRepository from '../../../../../modules/clients/repository/index.js';

export default class UserRouter extends AbstractRouter<void, RemoveAccountDto, ClientsRepository> {
  override async execute(req: IRemoveAccountReq): Promise<void> {
    const dto = new RemoveAccountDto(req.query);

    return this.controller.execute(dto, req);
  }
}
