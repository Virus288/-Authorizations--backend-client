import Log from 'simpleLogger';
import Router from './index.js';
import { ETokens, ETokenType } from '../../../../../enums/tokens.js';
import handleErr from '../../../../../errors/handler.js';
import ClientsRepository from '../../../../../modules/clients/repository/index.js';
import Controller from '../../../../../modules/users/subModules/finishLogout/index.js';
import ClientModel from '../../../../mongo/models/client.js';
import limitRate from '../../../utils/index.js';
import type * as types from '../../../../../types/index.js';
import type express from 'express';

const service = new Router(new Controller(new ClientsRepository(ClientModel)));

service.router.get('/logout/finish', limitRate, async (req: express.Request, res) => {
  try {
    const data = await service.execute(req);
    Log.debug('Logout - finish', `Got req to logout user ${data}`);

    res.cookie(ETokenType.Access, '');
    res.cookie(ETokens.Refresh, '');
    res.cookie(ETokens.SessionToken, '');
    res.redirect(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
