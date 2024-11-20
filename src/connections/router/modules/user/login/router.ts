import Router from './index.js';
import { ETTL } from '../../../../../enums/ttl.js';
import handleErr from '../../../../../errors/handler.js';
import ClientsRepository from '../../../../../modules/clients/repository/index.js';
import Controller from '../../../../../modules/users/subModules/login/index.js';
import ClientsModel from '../../../../mongo/models/client.js';
import limitRate from '../../../utils.js';
import type { ILoginReq } from './types.js';
import type * as types from '../../../../../types/index.js';
import type { CookieOptions } from 'express';

const service = new Router(new Controller(new ClientsRepository(ClientsModel)));

service.router.get('/login', limitRate, async (req: ILoginReq, res) => {
  try {
    const data = await service.execute(req);
    if (typeof data === 'string') {
      res.redirect(data);
      return;
    }

    const options: CookieOptions = {
      maxAge: ETTL.UserToken * 1000,
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    };
    const { url, cookie } = data as { url: string; cookie: string };

    res.cookie('authClient.token', cookie, options);
    res.redirect(url);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
