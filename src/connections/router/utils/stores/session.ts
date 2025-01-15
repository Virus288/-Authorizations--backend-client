import { Store } from 'express-session';
import Log from 'simpl-loggar';
import State from '../../../../tools/state.js';
import type { IUserSession } from '../../../../types/index.js';

export default class SessionStore extends Store {
  /**
   * Get existing session.
   * @param sid Session id.
   * @param callback Callback for session data.
   */
  @Log.decorateSyncDebug('Session', 'Getting session')
  get(sid: string, callback: (err: Error | null, session?: IUserSession | null) => void): void {
    State.redis
      .getSession(sid)
      .then((data) => {
        callback(null, data);
      })
      .catch((err) => {
        Log.error('Session', 'Could not get session');
        callback(err as Error, null);
      });
  }

  /**
   * Add new session.
   * @param sid Session id.
   * @param session Session data.
   * @param callback Callback, in case of error.
   */
  @Log.decorateSyncDebug('Session', 'Setting session')
  set(sid: string, session: IUserSession, callback?: (err?: Error | null) => void): void {
    State.redis
      .addSession(sid, session)
      .then(() => {
        if (callback) callback(null);
      })
      .catch((err) => {
        Log.error('Session', 'Could not set session');
        if (callback) callback(err as Error);
      });
  }

  /**
   * Remove session.
   * @param sid Session id.
   * @param callback Callback, in case of error.
   */
  @Log.decorateSyncDebug('Session', 'Removing session')
  destroy(sid: string, callback?: (err?: Error | null) => void): void {
    State.redis
      .removeSession(sid)
      .then(() => {
        if (callback) callback(null);
      })
      .catch((err) => {
        Log.error('Session', 'Could not remove session');
        if (callback) callback(err as Error);
      });
  }

  /**
   * Reset ttl for session.
   * @param sid Session id.
   * @param session Session data.
   * @param callback Callback, in case of error.
   */
  @Log.decorateSyncDebug('Session', 'Touching session')
  override touch(sid: string, session: IUserSession, callback?: (err?: Error | null) => void): void {
    State.redis
      .addSession(sid, session)
      .then(() => {
        if (callback) callback(null);
      })
      .catch((err) => {
        Log.error('Session', 'Could not set session');
        if (callback) callback(err as Error);
      });
  }
}
