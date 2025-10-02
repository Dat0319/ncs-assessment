import { Request, Response } from 'express';
import { RedisClient } from 'redis';
import HealthController from '../../src/modules/health/health.controller';
import { HealthService } from '../../src/modules/health/health.service';

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

// Mock the dependencies HealthService
jest.mock('../../src/modules/health/health.service', () => {
  return {
    HealthService: jest.fn().mockImplementation(() => ({
      ping: jest.fn().mockResolvedValue({ message: 'Pong! 🐱‍👤' }),
    })),
  };
});

describe('HealthController', () => {
  let healthController: HealthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize controller
    healthController = new HealthController();

    // Get the mocked service instance
    healthService = (healthController as any).healthService;

    // Mock request object
    mockRequest = {
      params: {},
      query: {},
      body: {},
    };

    // Mock response object
    mockResponse = {
      handler: jest.fn().mockImplementation((promise) => promise),
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe('ping', () => {
    it('should call healthService.ping and return health status', async () => {
      const result = await healthController.ping(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(healthService.ping).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Pong! 🐱‍👤' });
    });

    it('should return health check response with correct structure', async () => {
      const expectedResponse = {
        message: 'Pong! 🐱‍👤',
      };

      const result = await healthController.ping(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(healthService.ping).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('route initialization', () => {
    it('should initialize routes in constructor', () => {
      const controller = new HealthController();
      expect(controller).toBeDefined();
    });

    it('should initialize the health route', () => {
      const controller = new HealthController();
      expect((controller as any).path).toBe('/healths');
    });
  });
});
