/**
 * Controller
 * @module Notification Controller
 * @description Config controller
 */

import { Request, Response } from 'express';
import { permission, validate } from '../../common';
import { AppObject } from '../../common/consts';
import { RouteConfig } from '../../libs';
import { NotificationModel } from './notification.model';
import { NotificationService } from './notification.service';
import { NotificationValidation } from './notification.validation';

export default class NotificationController {
  private readonly notificationService: NotificationService;
  private readonly adminPath = '/admin/notifications';
  private readonly userPath = '/notifications';
  private readonly router = RouteConfig;

  constructor() {
    this._initializeRoutes();
    this.notificationService = new NotificationService();
  }

  private _initializeRoutes() {
    // this.router.get(`${this.userPath}`, [this.list.bind(this)]);
    // this.router.post(`${this.userPath}`, [this.create.bind(this)]);
    // this.router.get(`${this.userPath}/:id`, [this.getById.bind(this)]);
    // this.router.patch(`${this.userPath}/:id`, [this.updateById.bind(this)]);
    // this.router.delete(`${this.userPath}/:id`, [this.deleteById.bind(this)]);

    this.router.post(
      `${this.userPath}/recipients`,
      [
        validate(NotificationValidation.recipient),
        permission([AppObject.PERMISSION_ACTIONS.GET_NOTIFICATION_RECIPIENTS]),
        this.recipients.bind(this),
      ],
      { roles: [AppObject.CUSTOMER_ROLES.CUSTOMER] }
    );
  }

  /**
   * @method list
   * @description Get list
   */
  async list(req: Request, res: Response) {
    return res.handler(this.notificationService.list());
  }

  /**
   * @method create
   * @description Create new notification
   */
  async create(req: Request, res: Response) {
    return res.handler(this.notificationService.create());
  }

  /**
   * @method getById
   * @description Get detail by id
   * @param params {id}
   */
  async getById(req: Request, res: Response) {
    return res.handler(this.notificationService.getById());
  }

  /**
   * @method updateById
   * @description Update by id
   * @param params {id}
   */
  async updateById(req: Request, res: Response): Promise<NotificationModel> {
    return res.handler(this.notificationService.updateById());
  }

  /**
   * @method deleteById
   * @description Delete by id
   * @param params {id}
   */
  async deleteById(req: Request, res: Response): Promise<NotificationModel[]> {
    return res.handler(this.notificationService.deleteById());
  }

  /**
   * @method recipients
   * @description Get notification recipients
   */
  async recipients(req: Request, res: Response) {
    return res.handler(
      // @ts-ignore
      this.notificationService.recipients(req?.user, req.body)
    );
  }
}
