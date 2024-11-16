import AbstractRepository from '../../../tools/abstractions/repository.js';
import type { IClientRepository } from './types.js';
import type Client from '../../../connections/mongo/models/client.js';
import type { IClient } from '../../../connections/mongo/types/index.js';
import type * as enums from '../../../enums/index.js';
import type { IClientEntity } from '../../../types/entities.js';
import type mongoose from 'mongoose';
import type { FilterQuery } from 'mongoose';

export default class ClientsRepository
  extends AbstractRepository<IClient, typeof Client, enums.EModules.Client>
  implements IClientRepository
{
  async getByName(clientId: string): Promise<IClientEntity | null> {
    return this.model
      .findOne({ clientId } as FilterQuery<Record<string, string | mongoose.Types.ObjectId>>)
      .select({ __v: false })
      .lean();
  }
}
