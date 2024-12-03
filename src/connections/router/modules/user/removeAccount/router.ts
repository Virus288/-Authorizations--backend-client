import Router from './index.js';
import handleErr from '../../../../../errors/handler.js';
import ClientsRepository from '../../../../../modules/clients/repository/index.js';
import Controller from '../../../../../modules/users/subModules/removeAccount/index.js';
import ClientsModel from '../../../../mongo/models/client.js';
import limitRate from '../../../utils/index.js';
import type { IRemoveAccountReq } from './types.js';
import type * as types from '../../../../../types/index.js';

const service = new Router(new Controller(new ClientsRepository(ClientsModel)));

service.router.delete('/', limitRate, async (req: IRemoveAccountReq, res) => {
  try {
    await service.execute(req);
    res.sendStatus(200);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
