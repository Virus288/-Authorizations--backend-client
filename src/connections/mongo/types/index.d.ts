import type { IClientEntity, IUserEntity } from '../../../types/index.js';
import type mongoose from 'mongoose';

export interface IClient extends IClientEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IUser extends IUserEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
