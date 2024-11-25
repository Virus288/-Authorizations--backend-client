import type { ILoginDto } from '../../../../../modules/users/subModules/login/types.js';
import type { IQuery } from '../../../../../types/requests.js';
import type express from 'express';

export type ILoginReq = express.Request<unknown, unknown, unknown, ILoginDto & IQuery>;
