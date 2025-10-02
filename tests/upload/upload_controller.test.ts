import { Request, Response } from 'express';
import UploadController from '../../src/modules/upload/upload.controller';
import UploadService from '../../src/modules/upload/upload.service';

jest.mock('../../src/modules/upload/upload.service');

// Types and interfaces
interface UploadedFile {
  name: string;
  mimetype: string;
  size: number;
  data: Buffer;
}

// Constants
const FILE_CONSTANTS = {
  MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png'],
  TEST_FILE_SIZE: 1024,
  TEST_FILE_DATA: 'test',
} as const;

// Mock factory
const createMockRequest = (files?: UploadedFile): Partial<Request> => ({
  params: {},
  query: {},
  body: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    files: files || {
      file: {
        name: 'test.jpg',
        mimetype: 'image/jpeg',
        size: FILE_CONSTANTS.TEST_FILE_SIZE,
        data: Buffer.from(FILE_CONSTANTS.TEST_FILE_DATA),
      },
    },
  },
});

const createMockResponse = (): Partial<Response> => ({
  handler: jest.fn().mockImplementation((promise) => promise),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

describe('UploadController', () => {
  let uploadController: UploadController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let uploadService: jest.Mocked<UploadService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize controller
    uploadController = new UploadController();

    // Get the mocked service instance
    uploadService = (uploadController as any).uploadService;
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();

    // Mock response object
    mockResponse = {
      handler: jest.fn().mockImplementation((promise) => promise),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should call uploadService.upload with request and response', async () => {
      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });

    it('should handle file upload with type and description', async () => {
      mockRequest.body = {
        type: 'profile',
        description: 'User profile picture',
      };

      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });

    it('should handle file upload without optional parameters', async () => {
      mockRequest.body = {};

      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });

    it('should handle upload service errors', async () => {
      const error = new Error('Upload failed');
      uploadService.upload.mockRejectedValueOnce(error);

      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });
  });

  describe('route initialization', () => {
    it('should initialize routes in constructor', () => {
      const controller = new UploadController();
      expect(controller).toBeDefined();
    });

    it('should set up upload route', () => {
      const router = (uploadController as any).router;
      expect(router.post).toHaveBeenCalledWith('/upload', expect.any(Array));
    });
  });

  describe('error handling', () => {
    it('should handle missing file', async () => {
      mockRequest.body.files = {};

      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });

    it('should handle invalid file type', async () => {
      mockRequest.body.files = {
        file: {
          name: 'test.exe',
          mimetype: 'application/x-msdownload',
          size: 1024,
          data: Buffer.from('test'),
        },
      };

      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });

    it('should handle file size limit', async () => {
      mockRequest.body.files = {
        file: {
          name: 'large.jpg',
          mimetype: 'image/jpeg',
          size: 20 * 1024 * 1024, // 20MB
          data: Buffer.from('test'),
        },
      };

      await uploadController.upload(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(uploadService.upload).toHaveBeenCalledWith(
        mockRequest,
        mockResponse
      );
    });
  });
});
