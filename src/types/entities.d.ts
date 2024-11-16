import type mongoose from 'mongoose';

export interface IClientEntity {
  _id?: string | mongoose.Types.ObjectId;
  clientId: string;
  redirectUri: string;
}

export interface IUserEntity {
  _id?: string | mongoose.Types.ObjectId;
  userId: string;
  login: string;
}
