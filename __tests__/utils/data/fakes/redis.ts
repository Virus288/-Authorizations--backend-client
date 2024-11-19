import Redis from "../../../../src/connections/redis/index.js";
import * as enums from '../../../../src/enums/index.js'
import { IUserSession } from "../../../../src/types/index.js";

export default class FakeRedis extends Redis {
  private _sessions: { [key: string]: IUserSession } = {}

  private get sessions(): { [key: string]: IUserSession } {
    return this._sessions
  }

  private set sessions(val: { [key: string]: IUserSession }) {
    this._sessions = val
  }

  override async getSession(session: string): Promise<IUserSession | undefined> {
    return this.sessions[session]
  }

  override async setExpirationDate(_target: enums.ERedisTargets | string, _ttl: number): Promise<void> {
    return new Promise(resolve => {
      resolve()
    })
  }

  override async init(): Promise<void> {
    return new Promise(resolve => {
      resolve()
    })
  }

  override close(): void {
    return undefined
  }

  override async addSession(session: string, sessionData: IUserSession): Promise<void> {
    this.sessions[session] = sessionData
  }

  override async removeSession(session: string): Promise<void> {
    delete this.sessions[session]
  }

  getAllSession(): { [key: string]: IUserSession } {
    return this.sessions
  }

  clean(): void {
    this.sessions = {}
  }
}
