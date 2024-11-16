import type { IClientEntity, IUserEntity } from './entities.js';
import type * as enums from '../enums/index.js';
import type AddClient from '../modules/clients/repository/add.js';
import type AddUser from '../modules/users/repository/add.js';

export interface IRepositoryGetData {
  [enums.EModules.Client]: IClientEntity | null;
  [enums.EModules.User]: IUserEntity | null;
}

export interface IRepositoryAddData {
  [enums.EModules.Client]: AddClient;
  [enums.EModules.User]: AddUser;
}

export interface IGenericRepository<T extends enums.EModules> {
  get(id: string): Promise<IRepositoryGetData[T]>;
  add(data: IRepositoryAddData[T]): Promise<string>;
}
