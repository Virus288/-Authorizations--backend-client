import Validation from '../../../../tools/validation.js';
import type { IStartRegisterDto } from './types.js';

export default class StartRegisterDto implements IStartRegisterDto {
  readonly client: string;

  constructor(data: { client: string }) {
    this.client = data.client;

    this.validate();
  }

  private validate(): void {
    new Validation(this.client, 'client').isDefined().isString().hasMinLength(1);
  }
}
