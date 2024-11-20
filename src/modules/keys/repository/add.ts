import Validation from '../../../tools/validation.js';
import type { IAddKey } from './types.js';

export default class AddKey implements IAddKey {
  readonly kty: string;
  readonly kid: string;
  readonly alg: string;
  readonly e: string;
  readonly n: string;
  readonly d: string;
  readonly p: string;
  readonly q: string;
  readonly dp: string;
  readonly dq: string;
  readonly qi: string;

  constructor(data: IAddKey) {
    this.kty = data.kty;
    this.kid = data.kid;
    this.alg = data.alg;
    this.e = data.e;
    this.n = data.n;
    this.d = data.d;
    this.p = data.p;
    this.q = data.q;
    this.dp = data.dp;
    this.dq = data.dq;
    this.qi = data.qi;

    this.validate();
  }

  private validate(): void {
    new Validation(this.kty, 'kty').isDefined().isString().hasMinLength(1);
    new Validation(this.kid, 'kid').isDefined().isString().hasMinLength(1);
    new Validation(this.alg, 'alg').isDefined().isString().hasMinLength(1);
    new Validation(this.e, 'e').isDefined().isString().hasMinLength(1);
    new Validation(this.n, 'n').isDefined().isString().hasMinLength(1);
    new Validation(this.d, 'd').isDefined().isString().hasMinLength(1);
    new Validation(this.p, 'p').isDefined().isString().hasMinLength(1);
    new Validation(this.q, 'q').isDefined().isString().hasMinLength(1);
    new Validation(this.dp, 'dp').isDefined().isString().hasMinLength(1);
    new Validation(this.dq, 'dq').isDefined().isString().hasMinLength(1);
    new Validation(this.qi, 'qi').isDefined().isString().hasMinLength(1);
  }
}
