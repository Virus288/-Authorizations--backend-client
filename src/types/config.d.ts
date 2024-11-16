export interface IConfigInterface {
  mongoURI: string;
  port: number;
  corsOrigin: string[];
  myAddress: string;
  authorizationAddress: string;
  redisURI: string;
  session: {
    secret: string;
    secured: boolean;
    trustProxy: boolean;
  };
}
