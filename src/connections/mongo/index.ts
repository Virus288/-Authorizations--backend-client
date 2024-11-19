import mongoose from 'mongoose';
import Log from 'simpleLogger';
import getConfig from '../../tools/configLoader.js';
import type { ConnectOptions } from 'mongoose';

export default class Mongo {
  async init(): Promise<void> {
    await this.startServer();
  }

  disconnect(): void {
    mongoose.disconnect().catch((err) => {
      Log.error('Mongo', 'Cannot disconnect', (err as Error).message);
    });
  }

  protected async startServer(): Promise<void> {
    Log.debug('Mongo', 'Connecting to mongo');

    await mongoose.connect(getConfig().mongoURI, {
      dbName: 'AuthorizationsClient',
    } as ConnectOptions);
    Log.log('Mongo', 'Started server');
  }
}
