import { getCustomRepository } from 'typeorm';
import { AppObject } from '../../common/consts';
import RedisConfig from '../../configs/databases/redis.config';
import { UserRegisterTeacherRepository } from './entities/user-register-teacher.entity';
import { UserModel } from './user.interface';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

jest.mock('./user.repository');
jest.mock('./entities/user-register-teacher.entity');
jest.mock('../../utils/cache-manager.util');

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    getCustomRepository: jest.fn(),
  };
});

jest.mock('redis', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      connect: jest.fn(),
      quit: jest.fn(),
      on: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    }),
  };
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let userRegisterTeacherRepository: jest.Mocked<UserRegisterTeacherRepository>;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    updateByConditions: jest.fn(),
    manager: {
      createQueryBuilder: jest.fn(),
    },
  };

  const mockUserRegisterTeacherRepository = {
    findOne: jest.fn(),
    createDoc: jest.fn(),
    updateByConditions: jest.fn(),
  };

  beforeEach(() => {
    (UserService as any).instance = undefined;

    (getCustomRepository as jest.Mock).mockImplementation((repo) => {
      if (repo === UserRepository) return mockUserRepository;
      if (repo === UserRegisterTeacherRepository)
        return mockUserRegisterTeacherRepository;
    });

    userService = new UserService();

    userRepository = userService[
      'userRepository'
    ] as jest.Mocked<UserRepository>;
    userRegisterTeacherRepository = userService[
      'userRegisterTeacherRepository'
    ] as jest.Mocked<UserRegisterTeacherRepository>;
  });

  afterAll(async () => {
    await RedisConfig.client.quit();
  });

  it('1.1 [SUCCESS] should register students to a teacher', async () => {
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
    userRegisterTeacherRepository.createDoc = jest.fn().mockResolvedValue({});

    const result = await userService.teacherRegister('admin@example.com', {
      teacher: teacher.email,
      students: [student.email],
    });

    expect(result).toEqual({ succeed: true, status: 204 });
    expect(userRegisterTeacherRepository.createDoc).toHaveBeenCalledTimes(1);
  });

  it('1.2 [FAIL] should throw error if teacher is not of type TEACHER', async () => {
    const notTeacher = {
      id: 't1',
      email: 'not-a-teacher@example.com',
      type: AppObject.USER_TYPE.STUDENT,
    };

    userService['getUserByConditions'] = jest
      .fn()
      .mockResolvedValueOnce(notTeacher);

    await expect(
      userService.teacherRegister('admin@example.com', {
        teacher: notTeacher.email,
        students: [],
      })
    ).rejects.toThrow('userNotTeacher');
  });

  it('1.3 [FAIL] should throw error if any student is not of type STUDENT', async () => {
    const teacher = {
      id: 't1',
      email: 'teacher@example.com',
      type: AppObject.USER_TYPE.TEACHER,
    };

    const notStudent = {
      id: 's1',
      email: 'not-a-student@example.com',
      type: AppObject.USER_TYPE.TEACHER,
    };

    userService['getUserByConditions'] = jest
      .fn()
      .mockResolvedValueOnce(teacher)
      .mockResolvedValueOnce(notStudent);

    await expect(
      userService.teacherRegister('admin@example.com', {
        teacher: teacher.email,
        students: [notStudent.email],
      })
    ).rejects.toThrow('userNotStudent');
  });

  it('1.4 [FAIL] should skip update if student already registered and not deleted', async () => {
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

    const existingRegister = {
      id: 'reg1',
      studentId: student.id,
      teacherId: teacher.id,
      isDeleted: false,
    };

    userService['getUserByConditions'] = jest
      .fn()
      .mockResolvedValueOnce(teacher)
      .mockResolvedValueOnce(student);

    userRegisterTeacherRepository.findOne = jest
      .fn()
      .mockResolvedValue(existingRegister);
    userRegisterTeacherRepository.updateByConditions = jest
      .fn()
      .mockResolvedValue({});

    const result = await userService.teacherRegister('admin@example.com', {
      teacher: teacher.email,
      students: [student.email],
    });

    expect(result).toEqual({ succeed: true, status: 204 });
    expect(
      userRegisterTeacherRepository.updateByConditions
    ).not.toHaveBeenCalled();
  });

  it('2.1 [SUCCESS] should return students registered by all teachers', async () => {
    const teachers = [
      { id: 't1', email: 'teacher1@example.com' },
      { id: 't2', email: 'teacher2@example.com' },
    ];

    userRepository.find.mockResolvedValue(teachers as UserModel[]);

    const mockQueryBuilder = {
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

    const mockManager = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    Object.defineProperty(userRepository, 'manager', {
      get: () => mockManager,
    });

    const result = await userService.studentCommon({
      teachers: teachers.map((t) => t.email),
    });

    expect(result).toEqual({ students: ['student@example.com'] });
  });

  it('2.2 [FAIL] should throw error if any teacher email is not found', async () => {
    const inputEmails = ['teacher1@example.com', 'teacher2@example.com'];

    // Simulate only one teacher found
    userRepository.find = jest
      .fn()
      .mockResolvedValue([{ id: 't1', email: 'teacher1@example.com' }]);

    await expect(
      userService.studentCommon({ teachers: inputEmails })
    ).rejects.toThrow('emailTeacherNotFound');
  });

  it('2.3 [FAIL] should return empty student list if no students match criteria', async () => {
    const teachers = [
      { id: 't1', email: 'teacher1@example.com' },
      { id: 't2', email: 'teacher2@example.com' },
    ];

    userRepository.find = jest.fn().mockResolvedValue(teachers);

    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      having: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    Object.defineProperty(userRepository, 'manager', {
      get: () => ({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      }),
    });

    const result = await userService.studentCommon({
      teachers: teachers.map((t) => t.email),
    });

    expect(result).toEqual({ students: [] });
  });

  it('3.1 [SUCCESS] should suspend a student account', async () => {
    const student = {
      id: 's1',
      email: 'student@example.com',
      type: AppObject.USER_TYPE.STUDENT,
      status: AppObject.USER_STATUS.ACTIVE,
      isDeleted: false,
    };

    userService['getUserByConditions'] = jest.fn().mockResolvedValue(student);
    // userRepository.updateByConditions.mockResolvedValue({});
    userRepository.updateByConditions = jest.fn().mockResolvedValue({});

    const result = await userService.studentSuspend({ email: student.email });

    expect(result).toEqual({ succeed: true, status: 204 });
    expect(userRepository.updateByConditions).toHaveBeenCalledWith({
      conditions: { id: student.id },
      data: { status: AppObject.USER_STATUS.SUSPEND, isDeleted: true },
    });
  });

  it('3.2 [FAIL] should throw error if student is not found', async () => {
    userService['getUserByConditions'] = jest.fn().mockResolvedValue(null);

    await expect(
      userService.studentSuspend({ email: 'missing@student.com' })
    ).rejects.toThrow('userNotStudent');
  });

  it('3.3 [FAIL] should throw error if student is already suspended', async () => {
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
