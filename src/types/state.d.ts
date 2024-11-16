import type Mongo from '../connections/mongo/index.js';
import type Redis from '../connections/redis/index.js';
import type Router from '../connections/router/index.js';

export interface IState {
  router: Router;
  alive: boolean;
  mongo: Mongo;
  redis: Redis;
}
