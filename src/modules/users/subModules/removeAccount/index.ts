import Log from 'simpleLogger';
import OidcClientModel from '../../../../connections/mongo/models/oidcClient.js';
import UserModel from '../../../../connections/mongo/models/user.js';
import { EClientGrants, ETokens } from '../../../../enums/index.js';
import { InvalidRequest } from '../../../../errors/index.js';
import AbstractController from '../../../../tools/abstractions/controller.js';
import getConfig from '../../../../tools/configLoader.js';
import OidcClientsRepository from '../../../oidcClients/repository/index.js';
import TokensController from '../../../tokens/index.js';
import UsersRepository from '../../repository/index.js';
import type RemoveAccountDto from './dto.js';
import type ClientsRepository from '../../../clients/repository/index.js';
import type express from 'express';

export default class RemoveAccountController extends AbstractController<
  RemoveAccountDto,
  void,
  ClientsRepository,
  express.Request
> {
  override async execute(data: RemoveAccountDto, req: express.Request): Promise<void> {
    const client = await this.repository.getByName(data.client);
    if (!client) throw new InvalidRequest();

    const cookie = (req.cookies as Record<string, string>)[ETokens.Access];
    Log.debug('Remove account', `User token ${cookie}`);
    if (!cookie) throw new InvalidRequest();

    const user = await TokensController.validateToken(cookie);

    await this.remove(new TokensController(user.sub), user.sub);
  }

  private async remove(tokenController: TokensController, userId: string): Promise<void> {
    const clientRepo = new OidcClientsRepository(OidcClientModel);
    const client = await clientRepo.getByGrant(EClientGrants.AuthorizationCode);
    if (!client) throw new InvalidRequest();

    const tokens = await tokenController.getTokens();
    if (!tokens?.refreshToken) return this.removeLocalData(tokenController, userId);

    const body = JSON.stringify({
      client_id: client.clientId,
      token: tokens.refreshToken,
    });

    const res = await fetch(`${getConfig().authorizationAddress}/interaction/account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getConfig().myAddress,
      },
      body,
    });

    if (!res.ok) {
      Log.error('Logout', 'Error', JSON.stringify(await res.json()));
      throw new InvalidRequest();
    }

    Log.log('Logout', 'Logged out from oidc');
    return this.removeLocalData(tokenController, userId);
  }

  private async removeLocalData(tokenController: TokensController, userId: string): Promise<void> {
    await tokenController.removeUserTokens();
    await tokenController.logout();
    await tokenController.removeUserTokens();
    await new UsersRepository(UserModel).removeById(userId);
  }
}
