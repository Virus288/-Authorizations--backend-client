import Validation from '../../../tools/validation';
import type { IAddClient } from './types';

export default class AddClient implements IAddClient {
  readonly clientId: string;
  readonly redirectUri: string;

  constructor(data: IAddClient) {
    this.clientId = data.clientId;
    this.redirectUri = data.redirectUri;

    this.validate();
  }

  private validate(): void {
    new Validation(this.clientId, 'clientId').isDefined().isString().hasMinLength(1);
    new Validation(this.redirectUri, 'redirectUri').isDefined().isString().hasMinLength(1);
  }
}
