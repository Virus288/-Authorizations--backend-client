import Router from './index.js';
import handleErr from '../../../../../errors/handler.js';
import Controller from '../../../../../modules/users/subModules/validateToken/index.js';
import limitRate from '../../../utils/index.js';
import type * as types from '../../../../../types/index.js';

const service = new Router(new Controller(null));

service.router.get('/validate', limitRate, async (req, res) => {
  try {
    const data = await service.execute(req);

    res.send({ data });
  } catch (err) {
    handleErr(err as types.IFullError, res);
  }
});

export default service;
