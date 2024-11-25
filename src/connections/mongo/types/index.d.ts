import type { IClientEntity, ITokenEntity, IUserEntity, IKeyEntity, IOidcClientEntity } from '../../../types/index.js';
import type mongoose from 'mongoose';

export interface IClient extends IClientEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IOidcClient extends IOidcClientEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IUser extends IUserEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IToken extends ITokenEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IKey extends IKeyEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
