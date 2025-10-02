import express, { Application } from 'express';
import { createServer, Server as HttpServer } from 'http';
import 'newrelic';
import { AppConst } from './common/consts';
import { IServer } from './common/interfaces/app.interface';
import { bootstrapConfig, expressConfig, routeConfig } from './configs';
import APP_CONFIG from './configs/app.config';
import serverConfig from './configs/server.config';
import { RouteConfig } from './libs';
import logger from './utils/logger';

export default class Server implements IServer {
  private readonly app: Application;

  constructor() {
    this.app = express();
  }

  public start() {
    const server: HttpServer = createServer(this.app);
    RouteConfig.globalPrefix = `/${AppConst.API_VERSION}`;

    bootstrapConfig();
    expressConfig(this.app);
    routeConfig(this.app);
    serverConfig();

    server.listen(APP_CONFIG.ENV.APP.PORT, () => {
      logger.info(`[System] Server is running at ${APP_CONFIG.ENV.APP.PORT}!`);
    });
  }
}
