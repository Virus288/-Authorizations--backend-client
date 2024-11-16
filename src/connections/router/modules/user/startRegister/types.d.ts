import type { IStartRegisterDto } from '../../../../../modules/users/subModules/startRegister/types.js';
import type { IQuery } from '../../../../../types/requests.js';
import type express from 'express';

export type IStartRegisterReq = express.Request<unknown, unknown, unknown, IStartRegisterDto & IQuery>;
