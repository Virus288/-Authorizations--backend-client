import finishRegister from './finishRegister/router.js';
import login from './login/router.js';
import startRegister from './startRegister/router.js';
import type { Router } from 'express';

/**
 * Initialize routes for user router.
 * @param router Express router.
 */
export default function initUserRoutes(router: Router): void {
  const prefix = '/user';

  router.use(prefix, startRegister.router).use(prefix, finishRegister.router).use(prefix, login.router);
}
