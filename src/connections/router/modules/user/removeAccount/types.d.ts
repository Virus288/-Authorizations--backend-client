import type { IRemoveAccountDto } from '../../../../../modules/users/subModules/removeAccount/types.js';
import type { IQuery } from '../../../../../types/requests.js';
import type express from 'express';

export type IRemoveAccountReq = express.Request<unknown, unknown, unknown, IRemoveAccountDto & IQuery>;
