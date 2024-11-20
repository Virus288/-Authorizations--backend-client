import Validation from '../../../tools/validation.js';
import type { IAddToken } from './types.js';

export default class AddToken implements IAddToken {
  readonly ttl: string;
  readonly userId: string;
  readonly accessToken: string;
  readonly refreshToken: string;

  constructor(data: IAddToken) {
    this.ttl = new Date(Date.now() + parseInt(data.ttl)).toString();
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.ttl, 'ttl').isDefined().isString().hasMinLength(1);
    new Validation(this.userId, 'userId').isDefined().isString().hasMinLength(1);
    new Validation(this.accessToken, 'accessToken').isDefined().isString().hasMinLength(1);
    new Validation(this.refreshToken, 'refreshToken').isDefined().isString().hasMinLength(1);
  }
}
