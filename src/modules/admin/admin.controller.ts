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
    // this.router.get(
    //   `${this.adminPrefix}/profile`,
    //   [this.myProfile.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    // this.router.get(this.adminPrefix, [this.list.bind(this)], {
    //   roles: Object.values(AppObject.ADMIN_ROLES),
    // });
    // this.router.post(
    //   this.adminPrefix,
    //   [validate(AdminValidation.create), this.create.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    // this.router.get(
    //   `${this.adminPrefix}/:id`,
    //   [validate(UUIDValidation), this.detailById.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
    // this.router.patch(
    //   `${this.adminPrefix}/:id/status`,
    //   [validate(UUIDValidation), this.updateStatusById.bind(this)],
    //   { roles: [AppObject.ADMIN_ROLES.SUPER_ADMIN] }
    // );
    // this.router.patch(
    //   `${this.adminPrefix}/:id`,
    //   [validate(UUIDValidation), this.updateById.bind(this)],
    //   { roles: Object.values(AppObject.ADMIN_ROLES) }
    // );
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
