import type AddOidcClient from './add.js';
import type { EClientGrants } from '../../../enums/grants.js';
import type { IOidcClientEntity } from '../../../types/index.js';

export interface IAddOidcClient {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  clientGrant: string;
}

export interface IOidcClientRepository {
  add(user: AddOidcClient): Promise<string>;
  get(id: string): Promise<IOidcClientEntity | null>;
  getByGrant(grant: EClientGrants): Promise<IOidcClientEntity | null>;
  getByName(clientId: string): Promise<IOidcClientEntity | null>;
}
