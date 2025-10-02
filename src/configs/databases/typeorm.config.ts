import { ConnectionOptions } from 'typeorm';
import APP_CONFIG from '../app.config';
// import path from 'path';

const databaseConfig: ConnectionOptions = {
  type: 'mysql',
  host: APP_CONFIG.ENV.DATABASE.MYSQL.HOST,
  port: APP_CONFIG.ENV.DATABASE.MYSQL.PORT,
  username: APP_CONFIG.ENV.DATABASE.MYSQL.USERNAME,
  password: APP_CONFIG.ENV.DATABASE.MYSQL.PASSWORD,
  database: APP_CONFIG.ENV.DATABASE.MYSQL.NAME,
  entities: [
    `${
      process.env.NODE_ENV === 'local' ? 'src' : 'dist'
    }/modules/**/*.entity.{js,ts}`,
  ],
  // synchronize: true,
  // migrations: [path.join(__dirname, '../../migrations/*.{js,ts}')],
  // migrationsRun: true,
  // logging: true,
  // logging: ['query', 'error', 'schema', 'warn', 'info', 'log'], // Or a subset of these
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectTimeout: 20000,
  acquireTimeout: 20000,
  extra: {
    connectionLimit: 10,
  },
  maxQueryExecutionTime: 20000,
  // connectTimeoutMS: 20000,
  // logNotifications: true,
  // poolErrorHandler: (err) => {
  //   logger.error('Connection pool error', err);
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default databaseConfig;
