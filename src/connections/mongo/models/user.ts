import mongoose from 'mongoose';
import type { IUser } from '../types/index.js';

export const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'UserId not provided'],
  },
  login: {
    type: String,
    required: [true, 'Login not provided'],
  },
});

const User = mongoose.model<IUser>('Users', userSchema);
export default User;
