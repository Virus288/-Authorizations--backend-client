import AbstractRepository from '../../../tools/abstractions/repository.js';
import type { IUserRepository } from './types.js';
import type User from '../../../connections/mongo/models/user.js';
import type { IUser } from '../../../connections/mongo/types/index.js';
import type * as enums from '../../../enums/index.js';
import type { IUserEntity } from '../../../types/index.js';
import type { FilterQuery } from 'mongoose';

export default class UsersRepository
  extends AbstractRepository<IUser, typeof User, enums.EModules.User>
  implements IUserRepository
{
  async getByName(login: string): Promise<IUserEntity | null> {
    return this.model.findOne({ login } as FilterQuery<Record<string, string>>).lean();
  }
  async getByUserId(userId: string): Promise<IUserEntity | null> {
    return this.model.findOne({ userId } as FilterQuery<Record<string, string>>).lean();
  }
}
