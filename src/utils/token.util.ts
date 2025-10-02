import { CookieOptions, Response } from 'express';
import { decode, sign, verify } from 'jsonwebtoken';
import { AppConst } from '../common/consts';
import APP_CONFIG from '../configs/app.config';
import RedisConfig from '../configs/databases/redis.config';
import { TokenPayload } from '../modules/auth/auth.interface';
import { CacheManagerUtil } from './cache-manager.util';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: !(process.env.NODE_ENV !== 'production'),
  signed: true,
  sameSite: 'lax',
};

export class TokenUtil {
  private cacheManagerUtil: CacheManagerUtil;

  constructor() {
    this.cacheManagerUtil = new CacheManagerUtil(RedisConfig.client);
  }

  public sign(payload: TokenPayload, isAdmin = false) {
    const typeCache = isAdmin ? 'admins' : 'users';
    const accessToken = sign(
      payload,
      APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.SECRET_KEY,
      { expiresIn: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME }
    );
    const signedKey = accessToken.split('.')[2];
    const refreshToken = sign(
      Object.assign(payload, { signedKey: signedKey }),
      APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.SECRET_KEY,
      { expiresIn: APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.EXPIRED_TIME }
    );

    this.cacheManagerUtil.setKey({
      key: `caches:${typeCache}:${payload.id}:accessTokens:${signedKey}`,
      value: signedKey,
      exp: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME,
    });

    this.cacheManagerUtil.setKey({
      key: `caches:${typeCache}:${payload.id}:refreshTokens:${signedKey}`,
      value: refreshToken,
      exp: APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.EXPIRED_TIME,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiredTime: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME,
      tokenType: AppConst.TOKEN_TYPE,
    };
  }

  public signToken(payload: TokenPayload, isAdmin = false): string {
    const typeCache = isAdmin ? 'admins' : 'users';
    const accessToken = sign(
      payload,
      APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.SECRET_KEY,
      { expiresIn: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME }
    );

    this.cacheManagerUtil.setKey({
      key: `caches:${typeCache}:${payload.id}:accessTokens:${
        accessToken.split('.')[2]
      }`,
      value: accessToken.split('.')[2],
      exp: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME,
    });

    return accessToken;
  }

  public signRefreshToken(payload: TokenPayload, isAdmin = false): string {
    const typeCache = isAdmin ? 'admins' : 'users';
    const token = sign(
      { id: payload.id },
      APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.SECRET_KEY,
      { expiresIn: APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.EXPIRED_TIME }
    );

    this.cacheManagerUtil.setKey({
      key: `caches:${typeCache}:${payload.id}:refreshTokens:${
        token.split('.')[2]
      }`,
      value: token.split('.')[2],
      exp: APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.EXPIRED_TIME,
    });

    return token;
  }

  public verifyToken(token: string) {
    return verify(
      token,
      APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.SECRET_KEY
    ) as TokenPayload;
  }

  public verifyRefreshToken(token: string) {
    return verify(
      token,
      APP_CONFIG.ENV.SECURE.JWT_REFRESH_TOKEN.SECRET_KEY
    ) as TokenPayload;
  }

  public decodeToken(token: string) {
    return decode(token) as TokenPayload;
  }

  public clearTokens(res: Response, signedKey: string): void {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    this.cacheManagerUtil.delKey(`caches:sessions:${signedKey}`);
  }
}
