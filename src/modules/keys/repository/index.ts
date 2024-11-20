import AbstractRepository from '../../../tools/abstractions/repository.js';
import type { IKeyRepository } from './types.js';
import type Key from '../../../connections/mongo/models/keys.js';
import type { IKey } from '../../../connections/mongo/types/index.js';
import type * as enums from '../../../enums/index.js';
import type { IKeyEntity } from '../../../types/entities.js';

export default class KeyRepository
  extends AbstractRepository<IKey, typeof Key, enums.EModules.Key>
  implements IKeyRepository
{
  async getAll(): Promise<IKeyEntity[]> {
    return this.model.find().select({ __v: false }).lean();
  }
}
