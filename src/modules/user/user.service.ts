import { getCustomRepository, In } from 'typeorm';
import { AppObject } from '../../common/consts';
import {
  ParamsCommonGetDetail,
  ParamsUpdateCommonList,
} from '../../common/interfaces';
import RedisConfig from '../../configs/databases/redis.config';
import { ErrorHandler } from '../../libs/errors';
import { CacheManagerUtil } from '../../utils/cache-manager.util';
import {
  FacebookData,
  GoogleData,
  RegisterParams,
} from '../auth/auth.interface';
import { UserRegisterTeacherRepository } from './entities/user-register-teacher.entity';
import {
  StudentCommonParams,
  StudentSuspendParams,
  TeacherRegisterParams,
  UserModel,
} from './user.interface';
import { UserRepository } from './user.repository';

export class UserService {
  private static instance: UserService;
  private userRepository: UserRepository;
  private userRegisterTeacherRepository: UserRegisterTeacherRepository;
  private cacheManager: CacheManagerUtil;

  constructor() {
    if (UserService.instance) {
      return UserService.instance;
    }

    this.userRepository = getCustomRepository(UserRepository);
    this.userRegisterTeacherRepository = getCustomRepository(
      UserRegisterTeacherRepository
    );
    this.cacheManager = new CacheManagerUtil(RedisConfig.client);
    UserService.instance = this;
  }

  async updateByConditions(params: ParamsUpdateCommonList<UserModel>) {
    return this.userRepository.updateByConditions(params);
  }

  async detailByConditions(
    params: ParamsCommonGetDetail<UserModel>
  ): Promise<UserModel> {
    return this.userRepository.detailByConditions(params);
  }

  async getUserByConditions(
    params: ParamsCommonGetDetail<UserModel>
  ): Promise<UserModel> {
    const userFound = await this.detailByConditions(params);
    if (!userFound) {
      throw new ErrorHandler({ message: 'userNotFoundOrSuspended' });
    }

    if (userFound.status === AppObject.USER_STATUS.UNVERIFIED) {
      throw new ErrorHandler({ message: 'accountUnverified' });
    }

    if (userFound.status === AppObject.USER_STATUS.INACTIVE) {
      throw new ErrorHandler({ message: 'accountInactive' });
    }

    return userFound;
  }

  async getUserByFacebookId(data: FacebookData): Promise<UserModel> {
    let userFound = await this.detailByConditions({
      conditions: { facebookId: data.id },
      select: ['id'],
    });

    if (!userFound) {
      userFound = await this.userRepository.save({
        facebookId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        status: AppObject.USER_STATUS.ACTIVE,
      });
    }

    return userFound;
  }

  async getUserByGoogleId(data: GoogleData): Promise<UserModel> {
    let userFound = await this.detailByConditions({
      conditions: { googleId: data.id },
      select: ['id'],
    });

    if (!userFound) {
      userFound = await this.userRepository.save({
        googleId: data.id,
        firstName: data.given_name,
        lastName: data.family_name,
        status: AppObject.USER_STATUS.ACTIVE,
      });
    }

    return userFound;
  }

  async create(params: RegisterParams) {
    try {
      const userCreated = await this.userRepository.createDoc(params);
      return userCreated;
    } catch (error) {
      if (error.code === AppObject.ERR_CODE_DB.UNIQUE) {
        throw new ErrorHandler({ message: 'emailExists' });
      }
      throw error;
    }
  }

  async list(params) {
    const alias = 'user';
    const queryBuilder = this.userRepository.createQueryBuilder(alias).select();

    if (params.search) {
      queryBuilder.andWhere(`(${alias}.name ILIKE :name)`, {
        name: `%${params.search}%`,
      });
    }

    if (params.status) {
      queryBuilder.andWhere(`(${alias}.status = :status)`, {
        status: params.status,
      });
    }

    return this.userRepository.list({
      conditions: queryBuilder,
      paginate: params,
      alias: alias,
    });
  }

  async getProfile(userId: string) {
    return this.getUserByConditions({ conditions: { id: userId } });
  }

  async updateProfile(params: { userId: string; body }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updated = await this.userRepository.updateByConditions({
      conditions: { id: params.userId },
      data: params.body,
    });
    return { succeed: true };
  }

  async deleteById(userId: string) {
    await this.userRepository.updateByConditions({
      conditions: { id: userId },
      data: { isDeleted: true },
    });
    this.cacheManager.client.keys(`caches:users:${userId}:*`, (_err, data) => {
      data.push(`caches:profiles:${userId}`);
      this.cacheManager.delKey(data);
    });
    return { succeed: true };
  }

  async teacherRegister(userEmail: string, params: TeacherRegisterParams) {
    const { teacher, students } = params;
    const teacherFound = await this.getUserByConditions({
      conditions: { email: teacher },
    });

    if (teacherFound.type !== AppObject.USER_TYPE.TEACHER) {
      throw new ErrorHandler({ message: 'userNotTeacher' });
    }

    const studentUsers: UserModel[] = [];
    for (const studentEmail of students) {
      const studentFound = await this.getUserByConditions({
        conditions: { email: studentEmail },
      });

      if (studentFound.type !== AppObject.USER_TYPE.STUDENT) {
        throw new ErrorHandler({ message: 'userNotStudent' });
      }

      studentUsers.push(studentFound);
    }

    for (const student of studentUsers) {
      const existedRegisted = await this.userRegisterTeacherRepository.findOne({
        where: {
          studentId: student.id,
          teacherId: teacherFound.id,
        },
      });

      if (existedRegisted) {
        if (existedRegisted.isDeleted) {
          await this.userRegisterTeacherRepository.updateByConditions({
            conditions: { id: existedRegisted.id },
            overwriteConditions: { isDeleted: true },
            data: { isDeleted: false, updatedBy: userEmail },
          });
        }
      } else {
        await this.userRegisterTeacherRepository.createDoc({
          studentId: student.id,
          teacherId: teacherFound.id,
          createdBy: userEmail,
          updatedBy: userEmail,
        });
      }
    }

    return { succeed: true, status: 204 };
  }

  async studentCommon(params: StudentCommonParams) {
    const paramsTeachers = Array.isArray(params.teachers)
      ? params.teachers
      : [params.teachers];
    const teachers = await this.userRepository.find({
      where: {
        email: In(paramsTeachers),
        type: AppObject.USER_TYPE.TEACHER,
        isDeleted: false,
      },
    });
    if (teachers.length !== paramsTeachers.length) {
      throw new ErrorHandler({ message: 'emailTeacherNotFound' });
    }

    const teacherIds = teachers.map((t) => t.id);

    const alias = 'ts';
    const qb = this.userRepository.manager
      .createQueryBuilder()
      .select('student.email', 'email')
      .from('user_register_teacher', alias)
      .innerJoin('user', 'student', `${alias}.studentId = student.id`)
      .where(`${alias}.teacherId IN (:...teacherIds)`, { teacherIds })
      .andWhere('student.status != :suspend', {
        suspend: AppObject.USER_STATUS.SUSPEND,
      })
      .groupBy('student.email')
      .having('COUNT(DISTINCT ts.teacherId) = :teacherCount', {
        teacherCount: teacherIds.length,
      }); // đếm và chỉ lấy học sinh được đăng ký bởi tất cả giáo viên

    const rows = await qb.getRawMany();

    return {
      students: rows.map((r) => r.email),
    };
  }
  async studentSuspend(params: StudentSuspendParams) {
    const userFound = await this.getUserByConditions({
      conditions: { email: params.email, type: AppObject.USER_TYPE.STUDENT },
    });

    if (!userFound) {
      throw new ErrorHandler({ message: 'userNotStudent' });
    }

    if (
      userFound.status === AppObject.USER_STATUS.SUSPEND ||
      userFound.isDeleted
    ) {
      throw new ErrorHandler({ message: 'accountAlreadySuspended' });
    }

    await this.userRepository.updateByConditions({
      conditions: { id: userFound.id },
      data: { status: AppObject.USER_STATUS.SUSPEND, isDeleted: true },
    });

    return { succeed: true, status: 204 };
  }
}
