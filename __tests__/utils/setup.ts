import { afterAll, beforeAll } from '@jest/globals';
import Router from '../../src/connections/router';
import FakeRedis from './data/fakes/redis.js'
import State from '../../src/tools/state.js'
import FakeMongo from './data/fakes/mongo.js'

beforeAll(async () => {
  State.router = new Router()
  State.redis = new FakeRedis()
  State.mongo = new FakeMongo()

  State.router.init()
  State.mongo.init()
})

afterAll(() => {
  State.kill()
});
