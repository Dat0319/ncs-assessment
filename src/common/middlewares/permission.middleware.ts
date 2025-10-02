import RedisConfig from '../../configs/databases/redis.config';
import { ForbiddenError } from '../../libs/errors/forbidden.error';
import { CacheManagerUtil } from '../../utils/cache-manager.util';

const cacheManagerUtil = new CacheManagerUtil(RedisConfig.client);

export function permission(permissions: string[]) {
  return async (req: Request, res: Response, next: Function) => {
    // @ts-ignore
    const userId = req.user?.id;
    const roles = await cacheManagerUtil.getKey(`caches:roles:${userId}`);

    const hasPermission = permissions.some((permission) =>
      ((roles as string[] | null) || [])?.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new ForbiddenError({
          message: 'You do not have permission to access this route',
        })
      );
    }

    // @ts-ignore
    req.user.roles = roles;
    return next();
  };
}
