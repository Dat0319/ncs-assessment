import { AppObject } from '../../common/consts';
import { UserRegisterTeacherRepository } from './entities/user-register-teacher.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

jest.mock('./user.repository');
jest.mock('./entities/user-register-teacher.entity');
jest.mock('/src/utils/cache-manager.util.ts');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let userRegisterTeacherRepository: jest.Mocked<UserRegisterTeacherRepository>;

  beforeEach(() => {
    userService = new UserService();
    userRepository = userService[
      'userRepository'
    ] as jest.Mocked<UserRepository>;
    userRegisterTeacherRepository = userService[
      'userRegisterTeacherRepository'
    ] as jest.Mocked<UserRegisterTeacherRepository>;
  });

  it('should register students to a teacher', async () => {
    const teacher = {
      id: 't1',
      email: 'teacher@example.com',
      type: AppObject.USER_TYPE.TEACHER,
    };
    const student = {
      id: 's1',
      email: 'student@example.com',
      type: AppObject.USER_TYPE.STUDENT,
    };

    userService['getUserByConditions'] = jest
      .fn()
      .mockResolvedValueOnce(teacher)
      .mockResolvedValue(student);

    userRegisterTeacherRepository.findOne.mockResolvedValue(undefined);
    // userRegisterTeacherRepository.createDoc.mockResolvedValue({});
    userRegisterTeacherRepository.createDoc = jest.fn().mockResolvedValue({});

    const result = await userService.teacherRegister('admin@example.com', {
      teacher: teacher.email,
      students: [student.email],
    });

    expect(result).toEqual({ succeed: true, status: 204 });
    expect(userRegisterTeacherRepository.createDoc).toHaveBeenCalledTimes(1);
  });

  it('should return students registered by all teachers', async () => {
    const teachers = [
      { id: 't1', email: 'teacher1@example.com' },
      { id: 't2', email: 'teacher2@example.com' },
    ];

    userRepository.find.mockResolvedValue(teachers);

    const qb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      having: jest.fn().mockReturnThis(),
      getRawMany: jest
        .fn()
        .mockResolvedValue([{ email: 'student@example.com' }]),
    };

    userRepository.manager = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as any;

    const result = await userService.studentCommon({
      teachers: teachers.map((t) => t.email),
    });

    expect(result).toEqual({ students: ['student@example.com'] });
  });

  it('should suspend a student account', async () => {
    const student = {
      id: 's1',
      email: 'student@example.com',
      type: AppObject.USER_TYPE.STUDENT,
      status: AppObject.USER_STATUS.ACTIVE,
      isDeleted: false,
    };

    userService['getUserByConditions'] = jest.fn().mockResolvedValue(student);
    userRepository.updateByConditions.mockResolvedValue({});

    const result = await userService.studentSuspend({ email: student.email });

    expect(result).toEqual({ succeed: true, status: 204 });
    expect(userRepository.updateByConditions).toHaveBeenCalledWith({
      conditions: { id: student.id },
      data: { status: AppObject.USER_STATUS.SUSPEND, isDeleted: true },
    });
  });

  it('should throw error if student is already suspended', async () => {
    const student = {
      type: AppObject.USER_TYPE.STUDENT,
      status: AppObject.USER_STATUS.SUSPEND,
      isDeleted: true,
    };

    userService['getUserByConditions'] = jest.fn().mockResolvedValue(student);

    await expect(
      userService.studentSuspend({ email: 'student@example.com' })
    ).rejects.toThrow('accountAlreadySuspended');
  });
});
