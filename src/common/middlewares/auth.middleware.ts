import { NextFunction, Request, Response } from 'express';
import RedisConfig from '../../configs/databases/redis.config';
import { UnauthorizedError } from '../../libs/errors';
import { ForbiddenError } from '../../libs/errors/forbidden.error';
import { TokenUtil } from '../../utils';
import { CacheManagerUtil } from '../../utils/cache-manager.util';
import { AppConst, AppObject } from '../consts';

const tokenUtil = new TokenUtil();
const cacheManagerUtil = new CacheManagerUtil(RedisConfig.client);

export function authMiddleware(roles: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check token from header
      const token = req.headers['authorization'] || '';
      const [tokenType, accessToken] = token.split(' ');

      if (tokenType !== AppConst.TOKEN_TYPE) {
        throw new UnauthorizedError();
      }

      const user = tokenUtil.verifyToken(accessToken);
      const [userData, userSession] = await Promise.all([
        cacheManagerUtil.getKey(`caches:profiles:${user.id}`),
        cacheManagerUtil.getKeys(
          `caches:*:${user.id}:accessTokens:${accessToken.split('.')[2]}`
        ),
      ]);

      if (userSession?.length === 0 || !userData) {
        throw new UnauthorizedError();
      }
      userData.role =
        (userData.role as string) ?? AppObject.CUSTOMER_ROLES.CUSTOMER;

      if (!roles.includes(userData.role)) {
        throw new ForbiddenError();
      }
      req.user = userData as Express.TokenModel;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new UnauthorizedError({ code: 'TOKEN_EXPIRED' }));
      }
      return next(error);
    }
  };
}
