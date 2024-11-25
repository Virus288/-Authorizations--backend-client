import mongoose from 'mongoose';
import type { IToken } from '../types/index.js';

export const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'UserId not provided'],
    },
    ttl: {
      type: String,
      required: [true, 'TTL not provided'],
    },
    accessToken: {
      type: String,
      required: [true, 'AccessToken not provided'],
    },
    refreshToken: {
      type: String,
      required: [true, 'RefreshToken not provided'],
    },
  },
  { timestamps: true },
);

const Token = mongoose.model<IToken>('Tokens', tokenSchema);
export default Token;
