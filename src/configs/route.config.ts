import { Application, NextFunction, Request, Response } from 'express';
import globSync from 'glob/sync';
import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import { RouteConfig } from '../libs';
import { NotFoundError } from '../libs/errors/not-found.error';
import logger from '../utils/logger';

export const routeConfig = (app: Application): void => {
  app.get('/sockjs-node/info*', (_req: Request, res: Response) => {
    res.json({});
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(require(join(process.cwd(), './doc/swagger.json')), {
      explorer: true,
    })
  );

  app.use(
    (() => {
      globSync(join(__dirname, '../modules/**/**.controller.[tj]s')).forEach(
        (path: string) => new (require(path).default)()
      );
      for (const layer of RouteConfig.expressRouter.stack) {
        const method = layer?.route?.stack[0].method.toUpperCase() ?? [];
        logger.info(
          `[Router] ${method}${' '.repeat(6 - method.length)}: "${
            layer?.route?.path
          }" has been registered!`
        );
      }
      return RouteConfig.expressRouter;
    })()
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.error(error);
  });

  app.use((_req: Request, res: Response, next: NextFunction) => {
    // return res.error(new NotFoundError());
    if (!_req.route) {
      return res.error(
        new NotFoundError({
          message: `Route ${_req.method} ${_req.url} not found`,
        })
      );
    }
    next();
  });
};
