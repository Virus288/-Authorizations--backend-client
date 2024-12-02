import AbstractRepository from '../../../tools/abstractions/repository.js';
import type { IOidcClientRepository } from './types.js';
import type OidcClient from '../../../connections/mongo/models/oidcClient.js';
import type { IOidcClient } from '../../../connections/mongo/types/index.js';
import type * as enums from '../../../enums/index.js';
import type { IOidcClientEntity } from '../../../types/entities.js';
import type mongoose from 'mongoose';
import type { FilterQuery } from 'mongoose';

export default class OidcClientsRepository
  extends AbstractRepository<IOidcClient, typeof OidcClient, enums.EModules.OidcClient>
  implements IOidcClientRepository
{
  async getByGrant(clientGrant: enums.EClientGrants): Promise<IOidcClientEntity | null> {
    return this.model
      .findOne({ clientGrant } as FilterQuery<Record<string, string | mongoose.Types.ObjectId>>)
      .select({ __v: false })
      .lean();
  }

  async getByName(clientId: string): Promise<IOidcClientEntity | null> {
    return this.model
      .findOne({ clientId } as FilterQuery<Record<string, string | mongoose.Types.ObjectId>>)
      .select({ __v: false })
      .lean();
  }
}
