import type { IFinishRegisterDto } from '../../../../../modules/users/subModules/finishRegister/types.js';
import type { IQuery } from '../../../../../types/requests.js';
import type express from 'express';

export type IFinishRegisterReq = express.Request<unknown, unknown, unknown, IFinishRegisterDto & IQuery>;
