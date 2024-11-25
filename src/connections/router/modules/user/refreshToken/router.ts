import Router from './index.js';
import { ETokens } from '../../../../../enums/tokens.js';
import { ETTL } from '../../../../../enums/ttl.js';
import handleErr from '../../../../../errors/handler.js';
import UsersRepository from '../../../../../modules/users/repository/index.js';
import Controller from '../../../../../modules/users/subModules/refreshToken/index.js';
import UserModel from '../../../../mongo/models/user.js';
import limitRate from '../../../utils.js';
import type * as types from '../../../../../types/index.js';
import type { CookieOptions } from 'express';

const service = new Router(new Controller(new UsersRepository(UserModel)));

service.router.get('/refresh', limitRate, async (req, res) => {
  try {
    const token = await service.execute(req);
    const options: CookieOptions = {
      maxAge: ETTL.UserAccessToken * 1000,
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    };
    const accessOptions: CookieOptions = {
      ...options,
      maxAge: ETTL.UserAccessToken * 1000,
    };

    if (typeof token === 'string') {
      res.cookie(ETokens.Access, token, accessOptions);
      res.sendStatus(200);
      return;
    }

    const { accessToken, refreshToken, sessionToken } = token as {
      sessionToken: string | undefined;
      refreshToken: string;
      accessToken: string;
    };

    const refreshOptions: CookieOptions = {
      ...options,
      maxAge: ETTL.UserRefreshToken * 1000,
      path: '/user/refresh',
    };
    const sessionOptions: CookieOptions = {
      ...refreshOptions,
      maxAge: ETTL.UserSessionToken * 1000,
    };

    res.cookie(ETokens.Access, accessToken, accessOptions);
    res.cookie(ETokens.Refresh, refreshToken, refreshOptions);
    res.cookie(ETokens.SessionToken, sessionToken, sessionOptions);
    res.sendStatus(200);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
