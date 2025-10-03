import { getCustomRepository } from 'typeorm';
import { AppObject } from '../../common/consts';
import RedisConfig from '../../configs/databases/redis.config';
import { UserRepository } from '../user/user.repository';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    getCustomRepository: jest.fn(),
  };
});

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let userRepository: jest.Mocked<UserRepository>;
  let notificationRepository: jest.Mocked<NotificationRepository>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockNotificationRepository = {
    createDoc: jest.fn(),
  };

  beforeEach(() => {
    (NotificationService as any).instance = undefined;

    (getCustomRepository as jest.Mock).mockImplementation((repo) => {
      if (repo === UserRepository) return mockUserRepository;
      if (repo === NotificationRepository) return mockNotificationRepository;
    });

    notificationService = new NotificationService();
    userRepository = notificationService[
      'userRepository'
    ] as jest.Mocked<UserRepository>;
    notificationRepository = notificationService[
      'notificationRepository'
    ] as jest.Mocked<NotificationRepository>;
  });

  afterAll(async () => {
    await RedisConfig.client.quit();
  });

  it('1.1 [SUCCESS] should extract recipients from registered students and mentions', async () => {
    const teacher = {
      id: 't1',
      email: 'teacher@example.com',
      type: AppObject.USER_TYPE.TEACHER,
      isDeleted: false,
      students: [
        { email: 'student1@example.com', isDeleted: false },
        { email: 'student2@example.com', isDeleted: true }, // should be filtered out
      ],
    };

    userRepository.findOne = jest.fn().mockResolvedValue(teacher);

    const result = await notificationService.recipients('admin@example.com', {
      teacher: teacher.email,
      notification: 'Hello @student3@example.com and @student1@example.com',
    });

    expect(result.recipients).toEqual(
      expect.arrayContaining(['student1@example.com', 'student3@example.com'])
    );

    expect(notificationRepository.createDoc).toHaveBeenCalledWith({
      title: 'Notification sent to students of teacher@example.com',
      content: 'Hello @student3@example.com and @student1@example.com',
      emails: expect.stringContaining('student1@example.com'),
      createdBy: 'admin@example.com',
      updatedBy: 'admin@example.com',
    });
  });

  it('1.2 [FAIL] should throw error if teacher is not found', async () => {
    userRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(
      notificationService.recipients('admin@example.com', {
        teacher: 'missing@example.com',
        notification: 'Hello @student@example.com',
      })
    ).rejects.toThrow('Teacher with email missing@example.com not found');
  });
});
