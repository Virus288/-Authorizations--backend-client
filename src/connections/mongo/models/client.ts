import mongoose from 'mongoose';
import type { IClient } from '../types/index.js';

export const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: [true, 'Client_id not provided'],
  },
  redirectUri: {
    type: String,
    required: [true, 'Redirect_uris not provided'],
  },
  failUri: {
    type: String,
    required: [true, 'Fail url not provided'],
  },
});

const Client = mongoose.model<IClient>('Clients', clientSchema);
export default Client;
