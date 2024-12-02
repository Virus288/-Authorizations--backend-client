import Redis from "../../../../src/connections/redis/index.js";
import * as enums from '../../../../src/enums/index.js'
import { ISessionTokenData, IUserSession } from "../../../../src/types/index.js";

export default class FakeRedis extends Redis {
  private _sessions: { [key: string]: IUserSession } = {}
  private _sessionTokens: { [key: string]: ISessionTokenData } = {}

  private get sessions(): { [key: string]: IUserSession } {
    return this._sessions
  }

  private set sessions(val: { [key: string]: IUserSession }) {
    this._sessions = val
  }

  private get sessionTokens(): { [key: string]: ISessionTokenData } {
    return this._sessionTokens
  }

  private set sessionTokens(val: { [key: string]: ISessionTokenData }) {
    this._sessionTokens = val
  }


  override async getSession(session: string): Promise<IUserSession | null> {
    return new Promise(resolve => {
      resolve(this.sessions[session] ?? null)
    })
  }

  override async getSessionToken(id: string): Promise<ISessionTokenData | null> {
    return new Promise(resolve => {
      resolve(this.sessionTokens[id] ?? null)
    })
  }

  override async addSessionToken(id: string, sessionData: ISessionTokenData, _eol: Date): Promise<void> {
    return new Promise(resolve => {
      this.sessionTokens[id] = sessionData
      resolve()
    })
  }

  override async removeSessionToken(id: string): Promise<void> {
    return new Promise(resolve => {
      delete this.sessionTokens[id]
      resolve()
    })
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
