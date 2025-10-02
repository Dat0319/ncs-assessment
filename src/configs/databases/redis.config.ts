import { createClient } from 'redis';
import logger from '../../utils/logger';
import APP_CONFIG from '../app.config';

export default class RedisConfig {
  static client = createClient({
    host: APP_CONFIG.ENV.DATABASE.REDIS.HOST,
    port: APP_CONFIG.ENV.DATABASE.REDIS.PORT,
    password: APP_CONFIG.ENV.DATABASE.REDIS.PASSWORD,
    db: APP_CONFIG.ENV.DATABASE.REDIS.DATABASE,
    // url: `redis://default:${APP_CONFIG.ENV.DATABASE.REDIS.PASSWORD}@${APP_CONFIG.ENV.DATABASE.REDIS.HOST}:${APP_CONFIG.ENV.DATABASE.REDIS.PORT}`
  });

  async connectRedis() {
    RedisConfig.client.ping(() => {
      logger.info(`[Database][Redis] Database has connected successfully!`);
    });
    RedisConfig.client.on('error', (err) => {
      logger.error(err.stack);
      logger.error(`[Database][Redis] Database connection error.`);
      process.exit();
    });
  }
}
