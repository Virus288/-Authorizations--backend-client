export interface IIntrospection {
  active: boolean;
  sub: string;
  client_id: string;
  exp: number;
  iat: number;
  iss: string;
  scope: string;
}

export interface ITokenData {
  sub: string;
  iat: number;
  exp: number;
}

export interface ISessionTokenData extends ITokenData {
  id: string;
  ip: string[];
}
