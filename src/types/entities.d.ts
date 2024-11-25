import type mongoose from 'mongoose';

export interface IClientEntity {
  _id?: string | mongoose.Types.ObjectId;
  clientId: string;
  redirectUri: string;
}

export interface IOidcClientEntity {
  _id?: string | mongoose.Types.ObjectId;
  clientId: string;
  clientSecret: string;
  clientGrant: string;
  redirectUri: string;
}

export interface IUserEntity {
  _id?: string | mongoose.Types.ObjectId;
  userId: string;
  login: string;
}

export interface ITokenEntity {
  _id?: string | mongoose.Types.ObjectId;
  userId: string;
  ttl: string;
  accessToken: string;
  refreshToken: string;
}

export interface IKeyEntity {
  _id?: string | mongoose.Types.ObjectId;
  kty: string;
  kid: string;
  alg: string;
  e: string;
  n: string;
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
}
