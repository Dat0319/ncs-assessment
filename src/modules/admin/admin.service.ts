import { getCustomRepository } from 'typeorm';
import { AppObject } from '../../common/consts';
import { ParamsCommonGetDetail } from '../../common/interfaces';
import { ErrorHandler } from '../../libs/errors';
import { AdminLoginParams } from '../auth/auth.interface';
import { Admin } from './admin.entity';
import { CreateAdminParams } from './admin.model';
import { AdminRepository } from './admin.repository';

export class AdminService {
  private static instance: AdminService;
  private adminRepository: AdminRepository;

  constructor() {
    if (AdminService.instance) {
      return AdminService.instance;
    }

    this.adminRepository = getCustomRepository(AdminRepository);
    // this.init();
    AdminService.instance = this;
  }

  async detailByConditions(params: ParamsCommonGetDetail<Admin>) {
    return this.adminRepository.detailByConditions(params);
  }

  // async init() {
  //   return this.adminRepository.save({
  //     email: 'admin-ncs-assessment@gmail.com',
  //     password: 'adminA#@123456',
  //     firstName: 'Super',
  //     lastName: 'Admin',
  //     role: AppObject.ADMIN_ROLES.SUPER_ADMIN,
  //   });
  // }

  async myProfile(id: string) {
    return this.detailByConditions({ conditions: { id: id } });
  }

  async list(params) {
    const alias = 'admin';
    const queryBuilder = this.adminRepository
      .createQueryBuilder(alias)
      .select();

    if (params.search) {
      queryBuilder.andWhere(
        `(${alias}.firstName ILIKE :name OR ${alias}.lastName ILIKE :name)`,
        {
          name: `%${params.search}%`,
        }
      );
    }

    if (params.status) {
      queryBuilder.andWhere(`(${alias}.status = :status)`, {
        status: params.status,
      });
    }

    return this.adminRepository.list({
      conditions: queryBuilder,
      paginate: params,
      alias: alias,
    });
  }

  async login(params: AdminLoginParams) {
    const adminFound = await this.detailByConditions({
      conditions: { email: params.email, status: AppObject.USER_STATUS.ACTIVE },
      select: ['id', 'password'],
    });

    if (!adminFound) {
      throw new ErrorHandler({ message: 'accountNotFound' });
    }

    if (!adminFound.comparePassword(params.password)) {
      throw new ErrorHandler({ message: 'wrongPassword' });
    }

    this.adminRepository.updateByConditions({
      conditions: { id: adminFound.id },
      data: { lastLogin: new Date() },
    });

    return adminFound;
  }

  async detailById(id: string) {
    return this.detailByConditions({ conditions: { id: id } });
  }

  async updateStatusById(id: string, status: string) {
    const admin = await this.detailByConditions({
      conditions: { id: id },
      select: ['id', 'status'],
    });

    if (!admin) {
      throw new ErrorHandler({ message: 'accountNotFound' });
    }

    if (admin.role === AppObject.ADMIN_ROLES.SUPER_ADMIN) {
      throw new ErrorHandler({ message: 'updateSuperAdmin' });
    }

    this.adminRepository.updateByConditions({
      conditions: { id: id },
      data: { status: status },
    });

    return { succeed: true };
  }

  async updateById(id: string) {
    const admin = await this.detailByConditions({
      conditions: { id: id },
      select: ['id', 'status'],
    });

    if (!admin) {
      throw new ErrorHandler({ message: 'accountNotFound' });
    }

    if (admin.role === AppObject.ADMIN_ROLES.SUPER_ADMIN) {
      throw new ErrorHandler({ message: 'deleteSuperAdmin' });
    }

    this.adminRepository.updateByConditions({
      conditions: { id: id },
      data: { status: AppObject.USER_STATUS.DELETED },
    });

    return { succeed: true };
  }

  async deleteById(id: string) {
    const admin = await this.detailByConditions({
      conditions: { id: id },
      select: ['id', 'role'],
    });

    if (!admin) {
      throw new ErrorHandler({ message: 'accountNotFound' });
    }

    if (admin.role === AppObject.ADMIN_ROLES.SUPER_ADMIN) {
      throw new ErrorHandler({ message: 'deleteSuperAdmin' });
    }

    this.adminRepository.updateByConditions({
      conditions: { id: id },
      data: { status: AppObject.USER_STATUS.DELETED },
    });

    return { succeed: true };
  }

  async create(params: CreateAdminParams) {
    return this.adminRepository.save(params);
  }
}
