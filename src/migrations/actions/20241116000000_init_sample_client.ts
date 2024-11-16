import Client from '../../connections/mongo/models/client.js';

export default {
  async up(): Promise<undefined | number> {
    const client = new Client({
      clientId: 'register',
      redirectUri: 'http://127.0.0.1/register',
    });
    await client.save();

    return 1;
  },

  async down(): Promise<void> {
    await Client.findOneAndDelete({ client_id: 'register' });
  },
};
