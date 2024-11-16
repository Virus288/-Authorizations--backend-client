import Log from 'simpleLogger';
import State from '../../../../tools/state.js';
import type { IncrementResponse, Store } from 'express-rate-limit';

export default class RateLimitStore implements Store {
  private readonly _filter: RegExp = /\b(?:\d{1,3}\.){3}\d{1,3}\b/gu;

  private get filter(): RegExp {
    return this._filter;
  }
  /**
   * Increment request count for a given IP address.
   * @param key Client's ip address or key .
   * @returns Incremented session data.
   */
  @Log.decorateDebug('RateLimiter', 'Incrementing')
  async increment(key: string): Promise<IncrementResponse> {
    return State.redis.setRateLimit(key.match(this.filter)![0]);
  }

  /**
   * Reset the request count for a given user.
   * @param key Client's ip or key.
   */
  @Log.decorateDebug('RateLimiter', 'Resetting keys')
  async resetKey(key: string): Promise<void> {
    await State.redis.removeRateLimit(key.match(this.filter)![0]);
  }

  /**
   * Decrease hits for selected user.
   * @param key Client's ip or key.
   */
  @Log.decorateDebug('RateLimiter', 'Decrementing')
  async decrement(key: string): Promise<void> {
    await State.redis.decrementRateLimit(key.match(this.filter)![0]);
  }
}
