import Router from './index.js';
import handleErr from '../../../../../errors/handler.js';
import UsersRepository from '../../../../../modules/users/repository/index.js';
import Controller from '../../../../../modules/users/subModules/finishRegister/index.js';
import UserModel from '../../../../mongo/models/user.js';
import limitRate from '../../../utils/index.js';
import type { IFinishRegisterReq } from './types.js';
import type * as types from '../../../../../types/index.js';

const service = new Router(new Controller(new UsersRepository(UserModel)));

service.router.get('/register/finish', limitRate, async (req: IFinishRegisterReq, res) => {
  try {
    const data = await service.execute(req);
    res.redirect(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
