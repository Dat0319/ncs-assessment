import { Request, Response } from 'express';
import { RouteConfig } from '../../libs';
import { AdminService } from './admin.service';

export default class AdminController {
  private readonly router = RouteConfig;
  private readonly adminPrefix = '/admins';
  private readonly adminService: AdminService;

  constructor() {
    this.initializeRoutes();
    this.adminService = new AdminService();
  }

  private initializeRoutes() {
    /**
     * @api {get} /admins/profile Get Admin Profile
     * @apiName GetAdminProfile
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess {String} id Admin ID
     * @apiSuccess {String} email Admin email
     * @apiSuccess {Object} profile Admin profile information
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "email": "admin@example.com",
     *       "profile": {}
     *     }
     */
    // this.router.get(
    //   `${this.adminPrefix}/profile`,
    //   [this.myProfile.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    /**
     * @api {get} /admins List All Admins
     * @apiName GetAdmins
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Query) {Number} [page=1] Page number
     * @apiParam (Query) {Number} [limit=10] Items per page
     *
     * @apiSuccess {Object[]} admins List of admin users
     * @apiSuccess {String} admins.id Admin ID
     * @apiSuccess {String} admins.email Admin email
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [{
     *         "id": "uuid",
     *         "email": "admin@example.com"
     *       }],
     *       "total": 1
     *     }
     */
    // this.router.get(this.adminPrefix, [this.list.bind(this)], {
    //   roles: Object.values(AppObject.ADMIN_ROLES),
    // });
    /**
     * @api {post} /admins Create Admin
     * @apiName CreateAdmin
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Body) {String} email Admin email
     * @apiParam (Body) {String} password Admin password
     * @apiParam (Body) {String} [name] Admin name
     *
     * @apiSuccess {String} id Created admin ID
     * @apiSuccess {String} email Admin email
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "id": "uuid",
     *       "email": "newadmin@example.com"
     *     }
     */
    // this.router.post(
    //   this.adminPrefix,
    //   [validate(AdminValidation.create), this.create.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    /**
     * @api {get} /admins/:id Get Admin Details
     * @apiName GetAdminById
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} id Admin UUID
     *
     * @apiSuccess {String} id Admin ID
     * @apiSuccess {String} email Admin email
     * @apiSuccess {Object} profile Admin profile
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "email": "admin@example.com",
     *       "profile": {}
     *     }
     */
    // this.router.get(
    //   `${this.adminPrefix}/:id`,
    //   [validate(UUIDValidation), this.detailById.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    /**
     * @api {patch} /admins/:id/status Update Admin Status
     * @apiName UpdateAdminStatus
     * @apiGroup Admin
     * @apiPermission superadmin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} id Admin UUID
     * @apiParam (Body) {String} status New admin status
     *
     * @apiSuccess {String} id Admin ID
     * @apiSuccess {String} status Updated status
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "status": "active"
     *     }
     */
    // this.router.patch(
    //   `${this.adminPrefix}/:id/status`,
    //   [validate(UUIDValidation), this.updateStatusById.bind(this)],
    //   { roles: [AppObject.ADMIN_ROLES.SUPER_ADMIN] }
    // );
    /**
     * @api {patch} /admins/:id Update Admin
     * @apiName UpdateAdmin
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} id Admin UUID
     * @apiParam (Body) {String} [email] New email
     * @apiParam (Body) {String} [name] New name
     *
     * @apiSuccess {String} id Admin ID
     * @apiSuccess {String} email Updated email
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "email": "updated@example.com"
     *     }
     */
    // this.router.patch(
    //   `${this.adminPrefix}/:id`,
    //   [validate(UUIDValidation), this.updateById.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    /**
     * @api {delete} /admins/:id Delete Admin
     * @apiName DeleteAdmin
     * @apiGroup Admin
     * @apiPermission superadmin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} id Admin UUID
     *
     * @apiSuccess {Boolean} success Deletion status
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true
     *     }
     */
    // this.router.delete(
    //   `${this.adminPrefix}/:id`,
    //   [validate(UUIDValidation), this.deleteById.bind(this)],
    //   { roles: [AppObject.ADMIN_ROLES.SUPER_ADMIN] }
    // );
  }

  async myProfile(req: Request, res: Response) {
    return res.handler(this.adminService.myProfile(req.user.id));
  }

  async list(req: Request, res: Response) {
    return res.handler(this.adminService.list(req.query));
  }

  async create(req: Request, res: Response) {
    return res.handler(this.adminService.create(req.body));
  }

  async detailById(req: Request, res: Response) {
    return res.handler(this.adminService.detailById(req.params.id));
  }

  async updateById(req: Request, res: Response) {
    return res.handler(this.adminService.updateById(req.params.id));
  }

  async updateStatusById(req: Request, res: Response) {
    return res.handler(
      this.adminService.updateStatusById(req.params.id, req.body.status)
    );
  }

  async deleteById(req: Request, res: Response) {
    return res.handler(this.adminService.deleteById(req.params.id));
  }
}
