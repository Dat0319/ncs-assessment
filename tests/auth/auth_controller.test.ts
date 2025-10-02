import { Request, Response } from 'express';
import { RedisClient } from 'redis';
import AuthController from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';

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

// Mock the AuthService
jest.mock('../../src/modules/auth/auth.service', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      adminLogin: jest.fn().mockResolvedValue({}),
      login: jest.fn().mockResolvedValue({}),
      register: jest.fn().mockResolvedValue({}),
      verify: jest.fn().mockResolvedValue({}),
      resendOtp: jest.fn().mockResolvedValue({}),
      refreshToken: jest.fn().mockResolvedValue({}),
      logout: jest.fn().mockResolvedValue({}),
      socialLink: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock('../../src/common', () => ({
  validate: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize controller
    authController = new AuthController();

    // Get the mocked service instance
    authService = (authController as any).authService;

    // Mock request object
    mockRequest = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user: { id: 'test-user-id' },
      params: { social: 'google' },
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe('adminLogin', () => {
    it('should call authService.adminLogin with request body', async () => {
      const loginData = { email: 'admin@test.com', password: 'password123' };
      mockRequest.body = loginData;

      await authController.adminLogin(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.adminLogin).toHaveBeenCalledWith({ body: loginData });
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should call authService.login with request body', async () => {
      const loginData = { email: 'user@test.com', password: 'password123' };
      mockRequest.body = loginData;

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.login).toHaveBeenCalledWith({ body: loginData });
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should call authService.register with request body', async () => {
      const registerData = {
        email: 'user@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockRequest.body = registerData;

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.register).toHaveBeenCalledWith(registerData);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    it('should call authService.verify with request body', async () => {
      const verifyData = { email: 'user@test.com', code: '123456' };
      mockRequest.body = verifyData;

      await authController.verify(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.verify).toHaveBeenCalledWith({ body: verifyData });
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('resendOtp', () => {
    it('should call authService.resendOtp with request body', async () => {
      const otpData = { email: 'user@test.com' };
      mockRequest.body = otpData;

      await authController.resendOtp(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.resendOtp).toHaveBeenCalledWith({ body: otpData });
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken with token from body', async () => {
      const refreshData = { refreshToken: 'refresh-token-123' };
      mockRequest.body = refreshData;

      await authController.refreshToken(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.refreshToken).toHaveBeenCalledWith(
        refreshData.refreshToken
      );
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call authService.logout with user', async () => {
      await authController.logout(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.logout).toHaveBeenCalledWith(mockRequest.user);
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('socialLink', () => {
    it('should call authService.socialLink with response and social provider', async () => {
      await authController.socialLink(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.socialLink).toHaveBeenCalledWith(
        mockResponse,
        'google'
      );
      expect(mockResponse.handler).toHaveBeenCalled();
    });
  });

  describe('route initialization', () => {
    it('should initialize routes in constructor', () => {
      const controller = new AuthController();
      expect(controller).toBeDefined();
    });
  });
});
