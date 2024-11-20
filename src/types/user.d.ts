import type { Locals } from 'express';

export interface IUserLocals extends Locals {
  reqId: string;

  [key: string]: unknown;
}

export interface IUserServerTokens {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
}
