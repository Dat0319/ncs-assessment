import express from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { RouteOptions } from './router.interface';

export const expressRouter = express.Router();

type DynamicArray = any[];

export class RouteConfig {
  static globalPrefix: string;
  static readonly expressRouter = express.Router();

  static get(
    path: string,
    fn: DynamicArray,
    options?: RouteOptions
  ): RouteConfig {
    return RouteConfig.router('get', path, fn, options);
  }

  static post(
    path: string,
    fn: DynamicArray,
    options?: RouteOptions
  ): RouteConfig {
    return RouteConfig.router('post', path, fn, options);
  }

  static put(
    path: string,
    fn: DynamicArray,
    options?: RouteOptions
  ): RouteConfig {
    return RouteConfig.router('put', path, fn, options);
  }

  static patch(
    path: string,
    fn: DynamicArray,
    options?: RouteOptions
  ): RouteConfig {
    return RouteConfig.router('patch', path, fn, options);
  }

  static delete(
    path: string,
    fn: DynamicArray,
    options?: RouteOptions
  ): RouteConfig {
    return RouteConfig.router('delete', path, fn, options);
  }

  static router(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    path: string,
    fn: DynamicArray,
    options?: RouteOptions
  ): RouteConfig {
    if (options) {
      if (options.allowAnonymous) {
        // fn.unshift('token');
      } else {
        if (options.roles) {
          fn.unshift(authMiddleware(options.roles));
        }
      }
    }

    return this.expressRouter[method](`${RouteConfig.globalPrefix}${path}`, fn);
  }
}
