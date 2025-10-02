import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppObject } from '../common/consts';
import i18n from './i18n.config';

export const expressConfig = (app: Application): void => {
  app.use(helmet());
  app.use(cors());
  app.use(compression({ level: 6, threshold: 100 * 1000 }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(i18n.init);
  if (process.env.NODE_ENV !== AppObject.ENVIRONMENTS.PRODUCTION) {
    app.use(morgan('dev'));
  }
};
