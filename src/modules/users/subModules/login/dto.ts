import { MissingArgError } from '../../../../errors/index.js';
import Validation from '../../../../tools/validation.js';
import type { ILoginDto } from './types.js';

export default class LoginDto implements ILoginDto {
  readonly client?: string;
  readonly code?: string;

  constructor(data: ILoginDto) {
    this.client = data.client;
    this.code = data.code;

    this.validate();
  }

  private validate(): void {
    if (this.client) new Validation(this.client, 'client').isDefined().isString().hasMinLength(1);
    if (this.code) new Validation(this.code, 'code').isDefined().isString().hasMinLength(1);

    if (!this.code && !this.client) throw new MissingArgError('client');
  }
}
