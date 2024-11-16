import type { IUserLocals } from './user';
import type express from 'express';
import type { Session } from 'express-session';

export type IResponse = express.Response<unknown, IUserLocals>;

export interface IQuery {
  [key: string]: undefined | string | string[];
}

export interface IUserSession extends Session {
  userId?: string;
  nonce?: string;
  client?: string;
}
