import Router from './index.js';
import handleErr from '../../../../../errors/handler.js';
import ClientsRepository from '../../../../../modules/clients/repository/index.js';
import Controller from '../../../../../modules/users/subModules/startRegister/index.js';
import ClientsModel from '../../../../mongo/models/client.js';
import limitRate from '../../../utils/index.js';
import type { IStartRegisterReq } from './types.js';
import type * as types from '../../../../../types/index.js';

const service = new Router(new Controller(new ClientsRepository(ClientsModel)));

service.router.get('/register/start', limitRate, async (req: IStartRegisterReq, res) => {
  try {
    const data = await service.execute(req);
    res.redirect(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
