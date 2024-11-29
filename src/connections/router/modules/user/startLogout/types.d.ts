import type { IStartLogoutDto } from '../../../../../modules/users/subModules/startLogout/types.js';
import type { IQuery } from '../../../../../types/requests.js';
import type express from 'express';

export type IStartLogoutReq = express.Request<unknown, unknown, unknown, IStartLogoutDto & IQuery>;
