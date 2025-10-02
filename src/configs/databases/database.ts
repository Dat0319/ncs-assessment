import { createConnection } from 'typeorm';
import { IServer } from '../../common/interfaces/app.interface';
import logger from '../../utils/logger';
import APP_CONFIG from '../app.config';
// import RedisConfig from './redis.config';
import { DataSeeder } from '../../utils/data-seeder';
import databaseConfig from './typeorm.config';

export const databaseConnect = (app: IServer): void => {
  createConnection(databaseConfig)
    .then(async (connection) => {
      if (connection.isConnected) {
        logger.info(
          `[Database][${databaseConfig.type}] "${APP_CONFIG.ENV.DATABASE.MYSQL.NAME}" has connected successfully!`
        );

        const dataSeeder = new DataSeeder();
        await dataSeeder.seed();

        // new RedisConfig().connectRedis();
        app.start();
      } else {
        logger.error(
          `[Database][${databaseConfig.type}] Database has lost connection.`
        );
      }
    })
    .catch((err) => {
      logger.error(err.stack);
      logger.error(
        `[Database][${databaseConfig.type}] Database connection error.`
      );
      process.exit();
    });
};
