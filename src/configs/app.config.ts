import { normalize } from 'path';
import { AppObject } from '../common/consts';
import { AppEnvironment } from '../common/interfaces';
import { AppConfig } from '../common/interfaces/app-config.interface';

const setupEnvironment = (): AppEnvironment => {
  const mode =
    !!process.env.NODE_ENV && process.env.NODE_ENV != 'test'
      ? process.env.NODE_ENV
      : AppObject.ENVIRONMENTS.LOCAL;

  return require(`./environments/${mode}.env`).ENV;
};

export default {
  ROOT: normalize(__dirname + '../'),
  ENV: setupEnvironment(),
} as AppConfig;
