// eslint-disable-next-line import/prefer-default-export
export const ETTL = {
  ExpressSession: 60 * 15,
  ExpressRateLimiter: 60,
  UserAccessToken: 60 * 15,
  UserRefreshToken: 60 * 60 * 24 * 7,
  UserSessionToken: 60 * 60 * 24 * 14, // WARNING! This SHOULD NOT be set like this. This value should be dynamic, depending on ttl of refresh key from oidc
};
