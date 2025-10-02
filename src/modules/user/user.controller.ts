/**
 * @apiDefine admin Admin access only
 * Requires admin or super admin role.
 */

/**
 * @apiDefine customer Customer access only
 * Requires authenticated customer role.
 */

/**
 * @apiDefine UserNotFoundError
 * @apiError (404) {String} message User not found
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

import { Request, Response } from 'express';
import { permission, validate } from '../../common';
import { AppObject } from '../../common/consts';
import { RouteConfig } from '../../libs';
import { UserService } from './user.service';
import { StudentValidation, TeacherValidation } from './user.validation';

export default class UserController {
  private userService: UserService;
  private readonly adminPath = '/admin/users';
  private readonly userPath = '/users';
  private readonly teacherPath = '/teachers';
  private readonly studentPath = '/students';
  private readonly router = RouteConfig;

  constructor() {
    this._initializeRoutes();
    this.userService = new UserService();
  }

  private _initializeRoutes() {
    //#region Admin section
    /**
     * @api {get} /admin/users List Users
     * @apiVersion 1.0.0
     * @apiName ListUsers
     * @apiGroup User Management
     * @apiUse admin
     *
     * @apiParam (Query) {String} [search] Search by name or email
     * @apiParam (Query) {String} [status] Filter by user status
     * @apiParam (Query) {String} [role] Filter by user role
     * @apiParam (Query) {Number} [page=1] Page number
     * @apiParam (Query) {Number} [limit=20] Items per page
     * @apiParam (Query) {String} [sortBy=createdAt] Sort field
     * @apiParam (Query) {String} [sortOrder=desc] Sort order (asc/desc)
     *
     * @apiSuccess {Object[]} users List of users
     * @apiSuccess {String} users.id User ID
     * @apiSuccess {String} users.email Email address
     * @apiSuccess {String} users.name Full name
     * @apiSuccess {String} users.status Account status
     * @apiSuccess {String[]} users.roles User roles
     * @apiSuccess {Date} users.createdAt Registration date
     * @apiSuccess {Object} pagination Pagination details
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "users": [{
     *         "id": "uuid",
     *         "email": "user@example.com",
     *         "name": "John Doe",
     *         "status": "active",
     *         "roles": ["customer"],
     *         "createdAt": "2025-06-11T10:00:00Z"
     *       }],
     *       "pagination": {
     *         "total": 100,
     *         "page": 1,
     *         "limit": 20
     *       }
     *     }
     */
    // this.router.get(`${this.adminPath}`, [this.list.bind(this)], {
    //   roles: [AppObject.ADMIN_ROLES.ADMIN, AppObject.ADMIN_ROLES.SUPER_ADMIN],
    // });

    /**
     * @api {get} /admin/users/:id Get User Details
     * @apiVersion 1.0.0
     * @apiName GetUser
     * @apiGroup User Management
     * @apiUse admin
     *
     * @apiParam {String} id User's unique ID
     *
     * @apiSuccess {String} id User ID
     * @apiSuccess {String} email Email address
     * @apiSuccess {String} name Full name
     * @apiSuccess {String} status Account status
     * @apiSuccess {String[]} roles User roles
     * @apiSuccess {Date} createdAt Registration date
     * @apiSuccess {Date} lastLoginAt Last login date
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "email": "user@example.com",
     *       "name": "John Doe",
     *       "status": "active",
     *       "roles": ["customer"],
     *       "createdAt": "2025-06-11T10:00:00Z",
     *       "lastLoginAt": "2025-06-11T15:00:00Z"
     *     }
     *
     * @apiUse UserNotFoundError
     */
    // this.router.get(
    //   `${this.adminPath}/:id`,
    //   [validate(UUIDValidation), this.getById.bind(this)],
    //   {
    //     roles: [AppObject.ADMIN_ROLES.ADMIN, AppObject.ADMIN_ROLES.SUPER_ADMIN],
    //   }
    // );

    /**
     * @api {delete} /admin/users/:id Delete User
     * @apiVersion 1.0.0
     * @apiName DeleteUser
     * @apiGroup User Management
     * @apiUse admin
     *
     * @apiParam {String} id User's unique ID
     *
     * @apiSuccess {Boolean} success Operation status
     * @apiSuccess {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "message": "User deleted successfully"
     *     }
     *
     * @apiUse UserNotFoundError
     * @apiError (400) {String} message Cannot delete admin user
     */
    // this.router.delete(
    //   `${this.adminPath}/:id`,
    //   [validate(UUIDValidation), this.deleteById.bind(this)],
    //   {
    //     roles: [AppObject.ADMIN_ROLES.ADMIN, AppObject.ADMIN_ROLES.SUPER_ADMIN],
    //   }
    // );

    //#endregion Admin section

    //#region User section
    /**
     * @api {get} /users/profile Get Own Profile
     * @apiVersion 1.0.0
     * @apiName GetProfile
     * @apiGroup User Profile
     * @apiUse customer
     *
     * @apiSuccess {String} id User ID
     * @apiSuccess {String} email Email address
     * @apiSuccess {String} name Full name
     * @apiSuccess {Object} preferences User preferences
     * @apiSuccess {Date} createdAt Registration date
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "email": "user@example.com",
     *       "name": "John Doe",
     *       "preferences": {
     *         "language": "en",
     *         "timezone": "UTC"
     *       },
     *       "createdAt": "2025-06-11T10:00:00Z"
     *     }
     */
    // this.router.get(`${this.userPath}/profile`, [this.getProfile.bind(this)], {
    //   roles: [AppObject.CUSTOMER_ROLES.CUSTOMER],
    // });

    /**
     * @api {patch} /users/profile Update Profile
     * @apiVersion 1.0.0
     * @apiName UpdateProfile
     * @apiGroup User Profile
     * @apiUse customer
     *
     * @apiParam (Body) {String} [name] Updated full name
     * @apiParam (Body) {Object} [preferences] Updated preferences
     * @apiParam (Body) {String} [preferences.language] Preferred language
     * @apiParam (Body) {String} [preferences.timezone] Preferred timezone
     *
     * @apiSuccess {String} id User ID
     * @apiSuccess {String} name Updated name
     * @apiSuccess {Object} preferences Updated preferences
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "uuid",
     *       "name": "John Smith",
     *       "preferences": {
     *         "language": "es",
     *         "timezone": "America/New_York"
     *       }
     *     }
     *
     * @apiError (400) {Object} errors Validation errors
     */
    // this.router.patch(
    //   `${this.userPath}/profile`,
    //   [validate(UserValidation.updateProfile), this.updateProfile.bind(this)],
    //   { roles: [AppObject.CUSTOMER_ROLES.CUSTOMER] }
    // );

    this.router.get(`${this.userPath}`, [this.list.bind(this)], {
      roles: [AppObject.CUSTOMER_ROLES.CUSTOMER],
    });
    //#endregion User section

    this.router.post(
      `${this.teacherPath}/register/students`,
      [
        validate(TeacherValidation.register),
        permission([AppObject.PERMISSION_ACTIONS.REGISTER_STUDENT_TO_TEACHER]),
        this.teacherRegister.bind(this),
      ],
      { roles: [AppObject.CUSTOMER_ROLES.CUSTOMER] }
    );

    this.router.get(
      `${this.studentPath}/common`,
      [
        validate(StudentValidation.common),
        permission([AppObject.PERMISSION_ACTIONS.GET_COMMON_STUDENTS]),
        this.studentCommon.bind(this),
      ],
      { roles: [AppObject.CUSTOMER_ROLES.CUSTOMER] }
    );

    this.router.post(
      `${this.studentPath}/suspend`,
      [
        validate(StudentValidation.suspend),
        permission([AppObject.PERMISSION_ACTIONS.SUSPEND_STUDENT]),
        this.studentSuspend.bind(this),
      ],
      { roles: [AppObject.CUSTOMER_ROLES.CUSTOMER] }
    );
  }

  //#region Admin section
  async create(req: Request, res: Response) {
    return res.handler(this.userService.create(req.body));
  }

  async list(req: Request, res: Response) {
    return res.handler(this.userService.list(req.query));
  }

  async getById(req: Request, res: Response) {
    return res.handler(this.userService.getProfile(req.params.id));
  }

  async deleteById(req: Request, res: Response) {
    return res.handler(this.userService.deleteById(req.params.id));
  }
  //#endregion Admin section

  async getProfile(req: Request, res: Response) {
    return res.handler(this.userService.getProfile(req.user.id));
  }

  async updateProfile(req: Request, res: Response) {
    return res.handler(
      this.userService.updateProfile({ userId: req.user.id, body: req.body })
    );
  }

  //#region User section
  //#end region User section

  async teacherRegister(req: Request, res: Response) {
    return res.handler(
      this.userService.teacherRegister(req?.user?.email, req.body)
    );
  }
  async studentCommon(req: Request, res: Response) {
    return res.handler(
      this.userService.studentCommon({
        teachers: req.query.teachers as string[],
      })
    );
  }
  async studentSuspend(req: Request, res: Response) {
    return res.handler(this.userService.studentSuspend(req.body));
  }
}
