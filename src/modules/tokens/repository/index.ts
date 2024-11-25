import AbstractRepository from '../../../tools/abstractions/repository.js';
import type { ITokenRepository } from './types.js';
import type Token from '../../../connections/mongo/models/token.js';
import type { IToken } from '../../../connections/mongo/types/index.js';
import type * as enums from '../../../enums/index.js';
import type { ITokenEntity } from '../../../types/entities.js';
import type { FilterQuery } from 'mongoose';

export default class TokenRepository
  extends AbstractRepository<IToken, typeof Token, enums.EModules.Token>
  implements ITokenRepository
{
  async getByUserId(userId: string): Promise<ITokenEntity | null> {
    return this.model.findOne({ userId } as FilterQuery<Record<string, string>>).lean();
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.model.findOneAndDelete({ userId });
  }
}
