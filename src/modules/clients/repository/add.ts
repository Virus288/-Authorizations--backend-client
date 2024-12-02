import Validation from '../../../tools/validation.js';
import type { IAddClient } from './types.js';

export default class AddClient implements IAddClient {
  readonly clientId: string;
  readonly failUrl: string;
  readonly redirectUri: string;

  constructor(data: IAddClient) {
    this.clientId = data.clientId;
    this.redirectUri = data.redirectUri;
    this.failUrl = data.failUrl;

    this.validate();
  }

  private validate(): void {
    new Validation(this.clientId, 'clientId').isDefined().isString().hasMinLength(1);
    new Validation(this.failUrl, 'failUrl').isDefined().isString().hasMinLength(1);
    new Validation(this.redirectUri, 'redirectUri').isDefined().isString().hasMinLength(1);
  }
}
