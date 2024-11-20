import AbstractRepository from '../../../tools/abstractions/repository.js';
import type { ITokenRepository } from './types.js';
import type Token from '../../../connections/mongo/models/token.js';
import type { IToken } from '../../../connections/mongo/types/index.js';
import type * as enums from '../../../enums/index.js';

export default class TokenRepository
  extends AbstractRepository<IToken, typeof Token, enums.EModules.Token>
  implements ITokenRepository {}
