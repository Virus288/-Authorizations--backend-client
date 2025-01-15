import jose from 'node-jose';
import Log from 'simpl-loggar';
import AddKey from './repository/add.js';
import KeysRepository from './repository/index.js';
import KeyModel from '../../connections/mongo/models/keys.js';
import type { IKeyEntity } from '../../types/entities.js';

export default class Keys {
  private getKey = async (): Promise<IKeyEntity> => {
    const keystore = jose.JWK.createKeyStore();
    const key = await keystore.generate('RSA', 2048, { alg: 'RS256' });
    return key.toJSON(true) as IKeyEntity;
  };

  async createKeys(): Promise<void> {
    Log.debug('Keys', 'Creating key');
    const repo = new KeysRepository(KeyModel);

    const key = await this.getKey();
    const newKey = new AddKey(key);
    await repo.add(newKey);
  }
}
