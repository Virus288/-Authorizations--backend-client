import Validation from '../../../tools/validation.js';
import type { IAddUser } from './types.js';

export default class AddUser implements IAddUser {
  readonly userId: string;
  readonly login: string;

  constructor(data: IAddUser) {
    this.userId = data.userId;
    this.login = data.login;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString().hasMinLength(1);
    new Validation(this.login, 'login').isDefined().isString().hasMinLength(1);
  }
}
