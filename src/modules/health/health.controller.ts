import { Request, Response } from 'express';
import { RouteConfig } from '../../libs';
import { HealthService } from './health.service';

export default class HealthController {
  private readonly healthService: HealthService;
  private readonly path = '/healths';
  private readonly router = RouteConfig;

  constructor() {
    this._initializeRoutes();
    this.healthService = new HealthService();
  }

  private _initializeRoutes() {
    this.router.get(`${this.path}/ping`, [this.ping.bind(this)]);
  }

  /**
   * @api {get} /api/v1/healths/ping Health Check
   * @apiVersion 1.0.0
   * @apiName Get status health check
   * @apiGroup System Health
   *
   * @apiDescription Check the health status of the API service
   *
   * @apiSuccess {String} status Current health status
   * @apiSuccess {String} timestamp Current server timestamp
   * @apiSuccess {Object} info Additional health information
   * @apiSuccess {String} info.version API version
   * @apiSuccess {String} info.environment Current environment
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "healthy",
   *       "timestamp": "2025-06-11T10:00:00Z",
   *       "info": {
   *         "version": "1.0.0",
   *         "environment": "production"
   *       }
   *     }
   *
   * @apiError (500) {String} status Error status
   * @apiError (500) {String} message Error message
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   *     {
   *       "status": "error",
   *       "message": "Service unavailable"
   *     }
   */
  async ping(req: Request, res: Response) {
    return res.handler(this.healthService.ping());
  }
}
