import type AddToken from './add.js';
import type { ITokenEntity } from '../../../types/index.js';

export interface IAddToken {
  userId: string;
  ttl: string;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenRepository {
  add(user: AddToken): Promise<string>;
  get(id: string): Promise<ITokenEntity | null>;
}
