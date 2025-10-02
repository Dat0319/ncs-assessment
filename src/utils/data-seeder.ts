import { getCustomRepository } from 'typeorm';
import { AppObject } from '../common/consts';
import { Role } from '../modules/role/role.entity';
import { RoleRepository } from '../modules/role/role.repository';
import { UserRoleRepository } from '../modules/user/entities/user-role.entity';
import { UserModel } from '../modules/user/user.interface';
import { UserRepository } from '../modules/user/user.repository';
import logger from './logger';

export class DataSeeder {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;
  private userRoleRepository: UserRoleRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
    this.roleRepository = getCustomRepository(RoleRepository);
    this.userRoleRepository = getCustomRepository(UserRoleRepository);
  }

  async seed() {
    try {
      await this.createUser();
      await this.createRole();
      await this.createUserRole();

      const stack = new Error().stack;
      if (stack) {
        const callerLine = stack.split('\n')[1];
        logger.info(`All data seeded successfully!: ${callerLine.trim()}`);
      }

      logger.info('All data seeded successfully!');
    } catch (error) {
      logger.error('Error during data seeding:', error);
    }
  }

  async createUser() {
    const users: Partial<UserModel>[] = [
      // Admin
      {
        email: 'admin-ncs-assessment@gmail.com',
        password: '123456',
        firstName: 'Super',
        lastName: 'Admin',
        type: AppObject.USER_TYPE.TEACHER,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      // Teachers
      {
        email: 'teacher1@gmail.com',
        password: '123456',
        firstName: 'Teacher',
        lastName: 'One',
        type: AppObject.USER_TYPE.TEACHER,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'teacher2@gmail.com',
        password: '123456',
        firstName: 'Teacher',
        lastName: 'Two',
        type: AppObject.USER_TYPE.TEACHER,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'teacher3@gmail.com',
        password: '123456',
        firstName: 'Teacher',
        lastName: 'Three',
        type: AppObject.USER_TYPE.TEACHER,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'teacher4@gmail.com',
        password: '123456',
        firstName: 'Teacher',
        lastName: 'Four',
        type: AppObject.USER_TYPE.TEACHER,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      // Students
      {
        email: 'student1@gmail.com',
        password: '123456',
        firstName: 'Student',
        lastName: 'One',
        type: AppObject.USER_TYPE.STUDENT,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'student2@gmail.com',
        password: '123456',
        firstName: 'Student',
        lastName: 'Two',
        type: AppObject.USER_TYPE.STUDENT,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'student3@gmail.com',
        password: '123456',
        firstName: 'Student',
        lastName: 'Three',
        type: AppObject.USER_TYPE.STUDENT,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'student4@gmail.com',
        password: '123456',
        firstName: 'Student',
        lastName: 'Four',
        type: AppObject.USER_TYPE.STUDENT,
        status: AppObject.USER_STATUS.ACTIVE,
      },

      {
        email: 'teacherken@gmail.com',
        password: 'teacherPass123',
        firstName: 'Ken',
        lastName: 'Teacher',
        type: AppObject.USER_TYPE.TEACHER,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'studentjon@gmail.com',
        password: '123456',
        firstName: 'Jon',
        lastName: 'Student',
        type: AppObject.USER_TYPE.STUDENT,
        status: AppObject.USER_STATUS.ACTIVE,
      },
      {
        email: 'studenthon@gmail.com',
        password: '123456',
        firstName: 'Hon',
        lastName: 'Student',
        type: AppObject.USER_TYPE.STUDENT,
        status: AppObject.USER_STATUS.ACTIVE,
      },
    ];

    for (const user of users) {
      const exists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!exists) {
        await this.userRepository.save(this.userRepository.create(user));
      }
    }
    logger.info('Data seeded successfully!');
  }

  async createRole() {
    const roles: Partial<Role>[] = [
      {
        name: 'REGISTER STUDENT TO TEACHER',
        code: 'REGISTER_STUDENT_TO_TEACHER',
      },
      {
        name: 'GET COMMON STUDENTS',
        code: 'GET_COMMON_STUDENTS',
      },
      {
        name: 'SUSPEND STUDENT',
        code: 'SUSPEND_STUDENT',
      },
      {
        name: 'GET NOTIFICATION RECIPIENTS',
        code: 'GET_NOTIFICATION_RECIPIENTS',
      },
    ];

    for (const role of roles) {
      const exists = await this.roleRepository.findOne({
        where: { code: role.code },
      });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create(role));
      }
    }

    logger.info('Role seeding completed!');
  }

  async createUserRole() {
    // Users to attach roles to
    const targetEmails = [
      'admin-ncs-assessment@gmail.com',
      'teacher1@gmail.com',
      'teacherken@gmail.com',
    ];

    // Fetch users by email
    const users = await this.userRepository.find({
      where: targetEmails.map((email) => ({ email })),
    });

    if (users.length === 0) {
      logger.warn('No target users found for UserRole seeding.');
      return;
    }

    // Fetch all roles
    const roles = await this.roleRepository.find();

    if (roles.length === 0) {
      logger.warn('No roles found to assign.');
      return;
    }

    // Assign each role to each user
    for (const user of users) {
      for (const role of roles) {
        const exists = await this.userRoleRepository.findOne({
          where: { userId: user.id, roleId: role.id },
        });

        if (!exists) {
          const userRole = this.userRoleRepository.create({
            userId: user.id,
            roleId: role.id,
            createdBy: 'SEEDER',
            updatedBy: 'SEEDER',
          });
          await this.userRoleRepository.save(userRole);
        }
      }
    }

    logger.info('UserRole seeding completed!');
  }
}
