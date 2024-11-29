import Validation from '../../../../tools/validation.js';
import type { IStartLogoutDto } from './types.js';

export default class StartLogoutDto implements IStartLogoutDto {
  readonly client: string;

  constructor(data: { client: string }) {
    this.client = data.client;

    this.validate();
  }

  private validate(): void {
    new Validation(this.client, 'client').isDefined().isString().hasMinLength(1);
  }
}
