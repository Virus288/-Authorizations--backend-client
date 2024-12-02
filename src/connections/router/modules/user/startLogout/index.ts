import StartLogoutDto from '../../../../../modules/users/subModules/startLogout/dto.js';
import AbstractRouter from '../../../../../tools/abstractions/router.js';
import type { IStartLogoutReq } from './types.js';

export default class UserRouter extends AbstractRouter<string, StartLogoutDto, null> {
  override async execute(req: IStartLogoutReq): Promise<string> {
    const dto = new StartLogoutDto(req.query);

    return this.controller.execute(dto, req);
  }
}
