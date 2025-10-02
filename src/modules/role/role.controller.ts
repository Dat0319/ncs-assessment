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
    /**
     * @api {get} /admin/roles List Roles
     * @apiVersion 1.0.0
     * @apiName ListRoles
     * @apiGroup Role Management
     * @apiUse admin
     *
     * @apiParam (Query) {String} [status] Filter by role status
     * @apiParam (Query) {String} [from] Filter by start date (ISO format)
     * @apiParam (Query) {String} [to] Filter by end date (ISO format)
     * @apiParam (Query) {Number} [page=1] Page number
     * @apiParam (Query) {Number} [limit=20] Items per page
     *
     * @apiSuccess {Object[]} roles List of roles
     * @apiSuccess {String} roles.id Role ID
     * @apiSuccess {String} roles.userId Customer ID
     * @apiSuccess {Number} roles.total Role total amount
     * @apiSuccess {String} roles.status Role status
     * @apiSuccess {Date} roles.createdAt Role creation date
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     [{
     *       "id": "uuid",
     *       "userId": "user-uuid",
     *       "total": 99.99,
     *       "status": "pending",
     *       "createdAt": "2025-06-11T10:00:00Z"
     *     }]
     */
    // this.router.get(`${adminPath}`, [this.list.bind(this)]);

    /**
     * @api {post} /admin/roles Create Role (Admin)
     * @apiVersion 1.0.0
     * @apiName CreateRoleAdmin
     * @apiGroup Role Management
     * @apiUse admin
     *
     * @apiParam (Body) {String} userId Customer ID
     * @apiParam (Body) {Object[]} items Role items
     * @apiParam (Body) {String} items.productId Product ID
     * @apiParam (Body) {Number} items.quantity Quantity
     * @apiParam (Body) {Number} items.price Unit price
     *
     * @apiSuccess {String} id Created role ID
     * @apiSuccess {String} userId Customer ID
     * @apiSuccess {Object[]} items Role items
     * @apiSuccess {Number} total Role total
     * @apiSuccess {String} status Role status
     *
     * @apiError (400) {String} message Validation error message
     */
    // this.router.post(`${adminPath}`, [this.create.bind(this)]);

    /**
     * @api {get} /admin/roles/:id Get Role Details
     * @apiVersion 1.0.0
     * @apiName GetRole
     * @apiGroup Role Management
     * @apiUse admin
     *
     * @apiParam {String} id Role ID
     *
     * @apiSuccess {String} id Role ID
     * @apiSuccess {String} userId Customer ID
     * @apiSuccess {Object[]} items Role items
     * @apiSuccess {Number} total Role total
     * @apiSuccess {String} status Role status
     * @apiSuccess {Date} createdAt Creation date
     *
     * @apiError (404) {String} message Role not found
     */
    // this.router.get(`${adminPath}/:id`, [this.getById.bind(this)]);

    /**
     * @api {patch} /admin/roles/:id Update Role
     * @apiVersion 1.0.0
     * @apiName UpdateRole
     * @apiGroup Role Management
     * @apiUse admin
     *
     * @apiParam {String} id Role ID
     *
     * @apiParam (Body) {String} [status] New role status
     * @apiParam (Body) {Object[]} [items] Updated role items
     *
     * @apiSuccess {String} id Role ID
     * @apiSuccess {String} status Updated status
     *
     * @apiError (404) {String} message Role not found
     * @apiError (400) {String} message Invalid status transition
     */
    // this.router.patch(`${adminPath}/:id`, [this.updateById.bind(this)]);

    /**
     * @api {delete} /admin/roles/:id Delete Role
     * @apiVersion 1.0.0
     * @apiName DeleteRole
     * @apiGroup Role Management
     * @apiUse admin
     *
     * @apiParam {String} id Role ID
     *
     * @apiSuccess {Boolean} success Deletion status
     *
     * @apiError (404) {String} message Role not found
     * @apiError (400) {String} message Cannot delete processed role
     */
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
