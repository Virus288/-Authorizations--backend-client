import finishLogout from './finishLogout/router.js';
import finishRegister from './finishRegister/router.js';
import login from './login/router.js';
import refresh from './refreshToken/router.js';
import startLogout from './startLogout/router.js';
import startRegister from './startRegister/router.js';
import validate from './validateToken/router.js';
import type { Router } from 'express';

/**
 * Initialize routes for user router.
 * @param router Express router.
 */
export default function initUserRoutes(router: Router): void {
  const prefix = '/user';

  router
    .use(prefix, startRegister.router)
    .use(prefix, finishRegister.router)
    .use(prefix, login.router)
    .use(prefix, validate.router)
    .use(prefix, startLogout.router)
    .use(prefix, finishLogout.router)
    .use(prefix, refresh.router);
}
