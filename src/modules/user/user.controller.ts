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
    // this.router.get(`${this.adminPath}`, [this.list.bind(this)], {
    //   roles: [AppObject.ADMIN_ROLES.ADMIN, AppObject.ADMIN_ROLES.SUPER_ADMIN],
    // });

    // this.router.get(
    //   `${this.adminPath}/:id`,
    //   [validate(UUIDValidation), this.getById.bind(this)],
    //   {
    //     roles: [AppObject.ADMIN_ROLES.ADMIN, AppObject.ADMIN_ROLES.SUPER_ADMIN],
    //   }
    // );

    // this.router.delete(
    //   `${this.adminPath}/:id`,
    //   [validate(UUIDValidation), this.deleteById.bind(this)],
    //   {
    //     roles: [AppObject.ADMIN_ROLES.ADMIN, AppObject.ADMIN_ROLES.SUPER_ADMIN],
    //   }
    // );

    //#endregion Admin section

    //#region User section

    // this.router.get(`${this.userPath}/profile`, [this.getProfile.bind(this)], {
    //   roles: [AppObject.CUSTOMER_ROLES.CUSTOMER],
    // });

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
      // @ts-ignore
      this.userService.teacherRegister(req?.user, req.body)
    );
  }
  async studentCommon(req: Request, res: Response) {
    return res.handler(
      // @ts-ignore
      this.userService.studentCommon(req?.user, {
        teachers: req.query.teachers as string[],
      })
    );
  }
  async studentSuspend(req: Request, res: Response) {
    // @ts-ignore
    return res.handler(this.userService.studentSuspend(req?.user, req.body));
  }
}
