import type AddClient from './add.js';
import type { IClientEntity } from '../../../types/index.js';

export interface IAddClient {
  clientId: string;
  failUrl: string;
  redirectUri: string;
}

export interface IClientRepository {
  add(user: AddClient): Promise<string>;
  get(id: string): Promise<IClientEntity | null>;
  getByName(clientId: string): Promise<IClientEntity | null>;
}
