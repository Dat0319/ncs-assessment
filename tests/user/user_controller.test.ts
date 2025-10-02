import { Request, Response } from 'express';
import { RedisClient } from 'redis';
import UserController from '../../src/modules/user/user.controller';
import { UserService } from '../../src/modules/user/user.service';
import { AppObject } from '../../src/common/consts';
import express from 'express';

jest.setTimeout(10000);
// eslint-disable-next-line no-var
var mockRedisClient: jest.Mocked<RedisClient>;

jest.mock('../../src/configs/databases/redis.config', () => {
  mockRedisClient = {
    setex: jest.fn(),
    del: jest.fn(),
    get: jest.fn(),
    keys: jest.fn(),
    hset: jest.fn(),
    hget: jest.fn(),
    hgetall: jest.fn(),
    hdel: jest.fn(),
    rpush: jest.fn(),
    quit: jest.fn(),
    end: jest.fn(),
  } as unknown as jest.Mocked<RedisClient>;

  return {
    client: mockRedisClient,
  };
});

// Mock the UserService
jest.mock('../../src/modules/user/user.service', () => {
  return {
    UserService: jest.fn().mockImplementation(() => ({
      create: jest.fn().mockResolvedValue({}),
      list: jest.fn().mockResolvedValue({ users: [], pagination: {} }),
      getProfile: jest.fn().mockResolvedValue({}),
      deleteById: jest.fn().mockResolvedValue({ success: true }),
      updateProfile: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock('../../src/common', () => ({
  validate: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    patch: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    use: jest.fn().mockReturnThis(),
  })),
}));

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let userService: jest.Mocked<UserService>;
  // let routerMock: any;

  // beforeAll(() => {
  //   // Create router mock object first
  //   routerMock = {
  //     get: jest.fn().mockReturnThis(),
  //     post: jest.fn().mockReturnThis(),
  //     put: jest.fn().mockReturnThis(),
  //     patch: jest.fn().mockReturnThis(),
  //     delete: jest.fn().mockReturnThis(),
  //     use: jest.fn().mockReturnThis(),
  //   };
  //
  //   // Mock the Router constructor
  //   (express.Router as jest.Mock) = jest.fn(() => routerMock);
  // });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize controller
    userController = new UserController();

    // Get the mocked service instance
    userService = (userController as any).userService;

    // Mock request object
    mockRequest = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user: { id: 'test-user-id' },
      params: { id: 'test-id' },
      query: {},
      body: {},
    };

    // Mock response object
    mockResponse = {
      handler: jest.fn().mockImplementation((promise) => promise),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(async () => {
    if (mockRedisClient) {
      mockRedisClient.quit();
      mockRedisClient.end(true);
    }
    jest.useRealTimers();
    jest.restoreAllMocks();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe('list', () => {
    it('should call userService.list with query parameters', async () => {
      const queryParams = {
        search: 'john',
        status: 'active',
        role: 'customer',
        page: '1',
        limit: '20',
      };
      mockRequest.query = queryParams;

      await userController.list(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userService.list).toHaveBeenCalledWith(queryParams);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should call userService.getProfile with user ID', async () => {
      const userId = 'test-id';
      mockRequest.params = { id: userId };

      await userController.getById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userService.getProfile).toHaveBeenCalledWith(userId);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should call userService.deleteById with user ID', async () => {
      const userId = 'test-id';
      mockRequest.params = { id: userId };

      await userController.deleteById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userService.deleteById).toHaveBeenCalledWith(userId);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should call userService.getProfile with authenticated user ID', async () => {
      const userId = 'test-user-id';
      mockRequest.user = {
        id: userId,
        role: AppObject.ADMIN_ROLES.STAFF,
      };

      await userController.getProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userService.getProfile).toHaveBeenCalledWith(userId);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should call userService.updateProfile with user ID and update data', async () => {
      const userId = 'test-user-id';
      const updateData = {
        name: 'John Smith',
        preferences: {
          language: 'es',
          timezone: 'America/New_York',
        },
      };
      mockRequest.user = {
        id: userId,
        role: AppObject.ADMIN_ROLES.STAFF,
      };
      mockRequest.body = updateData;

      await userController.updateProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(userService.updateProfile).toHaveBeenCalledWith({
        userId,
        body: updateData,
      });
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('route initialization', () => {
    it('should initialize routes in constructor', () => {
      const controller = new UserController();
      expect(controller).toBeDefined();
    });

    it('should initialize admin and user paths correctly', () => {
      const controller = new UserController();
      expect((controller as any).adminPath).toBe('/admin/users');
      expect((controller as any).userPath).toBe('/users');
    });

    it('should set up admin routes with correct roles', () => {
      const router = (userController as any).router;
      expect(router.get).toHaveBeenCalledWith(
        '/admin/users',
        expect.any(Array),
        {
          roles: ['admin', 'super_admin'],
        }
      );
    });

    it('should set up user routes with customer role', () => {
      const router = (userController as any).router;
      expect(router.get).toHaveBeenCalledWith(
        '/users/profile',
        expect.any(Array),
        {
          roles: ['customer'],
        }
      );
    });
  });

  describe('validation', () => {
    it('should use UUID validation for user ID routes', () => {
      const router = (userController as any).router;
      expect(router.get).toHaveBeenCalledWith(
        '/admin/users/:id',
        expect.arrayContaining([expect.any(Function)]),
        expect.any(Object)
      );
    });

    it('should use user validation for profile update', () => {
      const router = (userController as any).router;
      expect(router.patch).toHaveBeenCalledWith(
        '/users/profile',
        expect.arrayContaining([expect.any(Function)]),
        expect.any(Object)
      );
    });
  });
});
