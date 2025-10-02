import { Request, Response } from 'express';
import AdminController from '../../src/modules/admin/admin.controller';
import { AdminService } from '../../src/modules/admin/admin.service';
import { RedisClient } from 'redis';

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

// Mock the dependencies AdminService
jest.mock('../../src/modules/admin/admin.service', () => {
  return {
    AdminService: jest.fn().mockImplementation(() => ({
      myProfile: jest.fn().mockResolvedValue({}),
      list: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
      detailById: jest.fn().mockResolvedValue({}),
      updateById: jest.fn().mockResolvedValue({}),
      updateStatusById: jest.fn().mockResolvedValue({}),
      deleteById: jest.fn().mockResolvedValue({}),
    })),
  };
});
jest.mock('../../src/common', () => ({
  validate: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('AdminController', () => {
  let adminController: AdminController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize controller
    adminController = new AdminController();

    // Get the mocked service instance
    adminService = (adminController as any).adminService;

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
      handler: jest.fn().mockImplementation(() => Promise.resolve()),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as Partial<Response>;
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
    jest.restoreAllMocks();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Allow any pending operations to complete
  });

  describe('myProfile', () => {
    it('should call adminService.myProfile with user id', async () => {
      try {
        const handlerPromise = adminController.myProfile(
          mockRequest as Request,
          mockResponse as Response
        );

        await expect(handlerPromise).resolves.not.toThrow();
        expect(adminService.myProfile).toHaveBeenCalledWith('test-user-id');
        expect(mockResponse.handler).toHaveBeenCalled();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Test failed with error:', error);
        throw error;
      }
    });
  });

  describe('list', () => {
    it('should call adminService.list with query params', async () => {
      mockRequest.query = { page: '1', limit: '10' };

      await adminController.list(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(adminService.list).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call adminService.create with request body', async () => {
      const adminData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test Admin',
      };
      mockRequest.body = adminData;

      await adminController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(adminService.create).toHaveBeenCalledWith(adminData);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('detailById', () => {
    it('should call adminService.detailById with params id', async () => {
      await adminController.detailById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(adminService.detailById).toHaveBeenCalledWith('test-id');
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('updateById', () => {
    it('should call adminService.updateById with params id', async () => {
      await adminController.updateById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(adminService.updateById).toHaveBeenCalledWith('test-id');
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('updateStatusById', () => {
    it('should call adminService.updateStatusById with id and status', async () => {
      mockRequest.body = { status: 'active' };

      await adminController.updateStatusById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(adminService.updateStatusById).toHaveBeenCalledWith(
        'test-id',
        'active'
      );
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('should call adminService.deleteById with params id', async () => {
      await adminController.deleteById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(adminService.deleteById).toHaveBeenCalledWith('test-id');
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('route initialization', () => {
    it('should initialize routes in constructor', () => {
      const controller = new AdminController();
      expect(controller).toBeDefined();
    });
  });
});
