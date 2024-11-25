import Router from './index.js';
import { ETokens } from '../../../../../enums/tokens.js';
import { ETTL } from '../../../../../enums/ttl.js';
import handleErr from '../../../../../errors/handler.js';
import Controller from '../../../../../modules/users/subModules/refreshToken/index.js';
import limitRate from '../../../utils.js';
import type * as types from '../../../../../types/index.js';
import type { CookieOptions } from 'express';

const service = new Router(new Controller(null));

service.router.get('/refresh', limitRate, async (req, res) => {
  try {
    const accessToken = await service.execute(req);

    const options: CookieOptions = {
      maxAge: ETTL.UserAccessToken * 1000,
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    };

    res.cookie(ETokens.Access, accessToken, options);
    res.sendStatus(200);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
