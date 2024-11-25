import type AddKey from './add.js';
import type { IKeyEntity } from '../../../types/index.js';

export interface IAddKey {
  kty: string;
  kid: string;
  alg: string;
  e: string;
  n: string;
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
}

export interface IKeyRepository {
  add(user: AddKey): Promise<string>;
  get(id: string): Promise<IKeyEntity | null>;
  getAll(): Promise<IKeyEntity[]>;
}
