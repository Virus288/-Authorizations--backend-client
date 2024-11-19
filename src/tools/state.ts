import Log from 'simpleLogger';
import type Mongo from '../connections/mongo/index.js';
import type Redis from '../connections/redis/index.js';
import type Router from '../connections/router/index.js';
import type { IState } from '../types/index.js';

class State implements IState {
  private _router: Router | null = null;
  private _alive: boolean = false;
  private _mongo: Mongo | null = null;
  private _redis: Redis | null = null;

  get router(): Router {
    return this._router as Router;
  }

  set router(value: Router) {
    this._router = value;
  }

  get alive(): boolean {
    return this._alive;
  }

  set alive(val: boolean) {
    this._alive = val;
  }

  get mongo(): Mongo {
    return this._mongo!;
  }

  set mongo(value: Mongo) {
    this._mongo = value;
  }

  get redis(): Redis {
    return this._redis!;
  }

  set redis(value: Redis) {
    this._redis = value;
  }

  kill(): void {
    this.router.close();
    this.mongo.disconnect();
    this.router.close();

    Log.log('Server', 'Server closed');
  }
}

export default new State();
