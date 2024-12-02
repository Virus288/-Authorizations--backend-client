import Log from 'simpleLogger';
import Router from './index.js';
import { ETTL, ETokens } from '../../../../../enums/index.js';
import handleErr from '../../../../../errors/handler.js';
import ClientsRepository from '../../../../../modules/clients/repository/index.js';
import Controller from '../../../../../modules/users/subModules/login/index.js';
import getConfig from '../../../../../tools/configLoader.js';
import ClientsModel from '../../../../mongo/models/client.js';
import limitRate from '../../../utils/index.js';
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
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
    };
    const accessOptions: CookieOptions = {
      ...options,
      maxAge: ETTL.UserAccessToken * 1000,
      domain: getConfig().myDomain,
    };
    const refreshOptions: CookieOptions = {
      ...options,
      maxAge: ETTL.UserRefreshToken * 1000,
      path: '/user/refresh',
      domain: getConfig().myDomain,
    };
    const sessionOptions: CookieOptions = {
      ...options,
      maxAge: ETTL.UserSessionToken * 1000,
      path: '/user/refresh',
    };

    Log.debug('Login router', 'Data', data);
    const { url, accessToken, refreshToken, sessionToken } = data as {
      url: string;
      accessToken: string;
      refreshToken: string;
      sessionToken: string;
    };

    res.cookie(ETokens.Access, accessToken, accessOptions);
    res.cookie(ETokens.Refresh, refreshToken, refreshOptions);
    res.cookie(ETokens.SessionToken, sessionToken, sessionOptions);
    Log.debug('Login router', `Moving user to ${url}`);
    res.redirect(url);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
