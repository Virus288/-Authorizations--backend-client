import Validation from '../../../tools/validation.js';
import type { IAddOidcClient } from './types.js';

export default class AddOidcClient implements IAddOidcClient {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly clientGrant: string;

  constructor(data: IAddOidcClient) {
    this.clientId = data.clientId;
    this.clientSecret = data.clientSecret;
    this.clientGrant = data.clientGrant;
    this.redirectUri = data.redirectUri;

    this.validate();
  }

  private validate(): void {
    new Validation(this.clientId, 'clientId').isDefined().isString().hasMinLength(1);
    new Validation(this.clientSecret, 'clientSecret').isDefined().isString().hasMinLength(1);
    new Validation(this.clientGrant, 'clientGrant').isDefined().isString().hasMinLength(1);
    new Validation(this.redirectUri, 'redirectUri').isDefined().isString().hasMinLength(1);
  }
}
