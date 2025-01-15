import Log from 'simpl-loggar';
import Router from './index.js';
import handleErr from '../../../../../errors/handler.js';
import Controller from '../../../../../modules/users/subModules/startLogout/index.js';
import limitRate from '../../../utils/index.js';
import type { IStartLogoutReq } from './types.js';
import type * as types from '../../../../../types/index.js';

const service = new Router(new Controller(null));

service.router.get('/logout/start', limitRate, async (req: IStartLogoutReq, res) => {
  try {
    const data = await service.execute(req);
    Log.debug('Logout - start', `Redirecting user to logout ${data}`);
    res.redirect(data);
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
