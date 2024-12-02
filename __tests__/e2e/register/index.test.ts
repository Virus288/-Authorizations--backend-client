import { describe, expect, it } from '@jest/globals';
import FakeRedis from '../../utils/data/fakes/redis.js'
import supertest from 'supertest'
import State from '../../../src/tools/state.js'
import { IFullError } from '../../../src/types/errors.js';
import { IStartRegisterDto } from '../../../src/modules/users/subModules/startRegister/types.js';
import Client from '../../../src/connections/mongo/models/client.js';
import { InvalidRequest, MissingArgError } from '../../../src/errors/index.js';
import { afterEach } from "@jest/globals";
import { IFinishRegisterDto } from '../../../src/modules/users/subModules/finishRegister/types.js';

describe('Generic tests', () => {
  const startBody: IStartRegisterDto = {
    client: 'register'
  }
  const finishBody: IFinishRegisterDto = {
    userId: "test",
    login: "test2"
  }

  afterEach(() => {
    (State.redis as FakeRedis).clean()
  })

  describe('Should throw', () => {
    describe('No data', () => {
      it(`Start - Missing client`, async () => {
        const localBody = structuredClone(startBody) as Partial<IStartRegisterDto>
        delete localBody.client
        const target = new MissingArgError('client')

        const res = await supertest(State.router.getServer())
          .get(`/user/register/start?${new URLSearchParams(localBody).toString()}`).send();

        const reqBody = res.body as { error: IFullError };

        expect(reqBody.error.message).toEqual(target.message);
      });

      it(`Finish - Missing userId`, async () => {
        const localBody = structuredClone(finishBody) as Partial<IFinishRegisterDto>
        delete localBody.userId
        const target = new MissingArgError('userId')

        const res = await supertest(State.router.getServer())
          .get(`/user/register/finish?${new URLSearchParams(localBody).toString()}`).send();

        const reqBody = res.body as { error: IFullError };

        expect(reqBody.error.message).toEqual(target.message);
      });

      it(`Finish - Missing login`, async () => {
        const localBody = structuredClone(finishBody) as Partial<IFinishRegisterDto>
        delete localBody.login
        const target = new MissingArgError('login')

        const res = await supertest(State.router.getServer())
          .get(`/user/register/finish?${new URLSearchParams(localBody).toString()}`).send();

        const reqBody = res.body as { error: IFullError };

        expect(reqBody.error.message).toEqual(target.message);
      });
    });

    describe('Incorrect data', () => {
      it(`Start - Incorrect client`, async () => {
        const localBody = structuredClone(startBody) as Partial<IStartRegisterDto>
        const target = new InvalidRequest()

        const res = await supertest(State.router.getServer())
          .get(`/user/register/start?${new URLSearchParams({ ...localBody, client: 'a' }).toString()}`).send();

        const reqBody = res.body as { error: IFullError };

        expect(reqBody.error.message).toEqual(target.message);
      });
    })

    describe('Should pass', () => {
      it(`Start`, async () => {
        const client = new Client({
          clientId: 'register',
          redirectUri: 'http://127.0.0.1/register',
          failUri: "http://127.0.0.1/register"
        })
        await client.save()

        const res = await supertest(State.router.getServer())
          .get(`/user/register/start?${new URLSearchParams(structuredClone(startBody) as Partial<IStartRegisterDto>).toString()}`).send();

        expect(res.status).toEqual(302);
      });

      // #TODO This test requires faked response from external oidc server.
      //it(`Finish`, async () => {
      //  const client = new Client({
      //    clientId: 'register',
      //    redirectUri: 'http://127.0.0.1/register'
      //  })
      //  await client.save()
      //
      //  const res = await supertest(State.router.getServer())
      //    .get(`/user/register/finish?${new URLSearchParams(structuredClone(finishBody) as Partial<IFinishRegisterDto>).toString()}`).send();
      //
      //  expect(res.status).toEqual(302);
      //});
    })
  });
})
