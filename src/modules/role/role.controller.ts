/**
 * @apiDefine admin Admin access only
 * Requires admin role access token.
 */

/**
 * @apiDefine customer Customer access only
 * Requires customer role access token.
 */

import { Request, Response } from 'express';
import { AppObject } from '../../common/consts';
import { RouteConfig } from '../../libs';
import { RoleModel } from './role.model';
import { RoleService } from './role.service';

export default class RoleController {
  private readonly roleService: RoleService;
  private readonly router = RouteConfig;

  constructor() {
    this._initializeRoutes();
    this.roleService = new RoleService();
  }

  private _initializeRoutes() {
    const adminPath = '/admin/roles';
    // this.router.get(`${adminPath}`, [this.list.bind(this)]);

    // this.router.post(`${adminPath}`, [this.create.bind(this)]);

    // this.router.get(`${adminPath}/:id`, [this.getById.bind(this)]);

    // this.router.patch(`${adminPath}/:id`, [this.updateById.bind(this)]);

    // this.router.delete(`${adminPath}/:id`, [this.deleteById.bind(this)]);

    //#region User section
    const userPath = '/roles';
    /**
     * @api {post} /roles Create Role (Customer)
     * @apiVersion 1.0.0
     * @apiName CreateRoleCustomer
     * @apiGroup Roles
     * @apiUse customer
     *
     * @apiParam (Body) {Object[]} items Role items
     * @apiParam (Body) {String} items.productId Product ID
     * @apiParam (Body) {Number} items.quantity Quantity
     * @apiParam (Body) {String} [couponCode] Coupon code
     *
     * @apiSuccess {String} id Created role ID
     * @apiSuccess {Object[]} items Role items
     * @apiSuccess {Number} total Role total
     * @apiSuccess {Number} discount Applied discount
     * @apiSuccess {String} status Role status
     *
     * @apiError (400) {String} message Validation error message
     * @apiError (400) {String} message Invalid coupon code
     */
    this.router.post(`${userPath}`, [this.create.bind(this)], {
      roles: [AppObject.CUSTOMER_ROLES.CUSTOMER],
    });

    this.router.get(`${userPath}`, [this.list.bind(this)], {
      roles: [AppObject.CUSTOMER_ROLES.CUSTOMER],
    });
  }

  /**
   * @method list
   * @description Get list
   */
  async list(req: Request, res: Response) {
    return res.handler(this.roleService.list());
  }

  /**
   * @method create
   * @description Create new role
   */
  async create(req: Request, res: Response) {
    return res.handler(
      this.roleService.create({ user: req.user, body: req.body })
    );
  }

  /**
   * @method getById
   * @description Get detail by id
   * @param params {id}
   */
  async getById(req: Request, res: Response) {
    return res.handler(this.roleService.getById());
  }

  /**
   * @method updateById
   * @description Update by id
   * @param params {id}
   */
  async updateById(req: Request, res: Response): Promise<RoleModel> {
    return res.handler(this.roleService.updateById());
  }

  /**
   * @method deleteById
   * @description Delete by id
   * @param params {id}
   */
  async deleteById(req: Request, res: Response): Promise<RoleModel[]> {
    return res.handler(this.roleService.deleteById());
  }
}
