/**
 * @apiDefine public Public access
 * No authentication required
 */

/**
 * @apiDefine FileUploadError
 * @apiError (400) {String} message File validation error message
 * @apiError (413) {String} message File too large
 * @apiError (415) {String} message Unsupported file type
 * @apiError (500) {String} message Upload failed
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "No file provided"
 *     }
 */

import { Request, Response } from 'express';
import { RouteConfig } from '../../libs';
import UploadService from './upload.service';

export default class UploadController {
  private readonly uploadService = new UploadService();
  private readonly router = RouteConfig;

  constructor() {
    this._initializeRoutes();
  }

  private _initializeRoutes() {
    /**
     * @api {post} /upload Upload File
     * @apiVersion 1.0.0
     * @apiName UploadFile
     * @apiGroup File Management
     * @apiUse public
     *
     * @apiDescription Upload a file to the server. Supports various file types including images,
     * documents, and other allowed formats.
     *
     * @apiHeader {String} [Content-Type=multipart/form-data] Request content type
     *
     * @apiParam (Body) {File} file File to upload
     * @apiParam (Body) {String} [type] File type category (e.g., "profile", "document", "product")
     * @apiParam (Body) {String} [description] File description
     *
     * @apiSuccess {String} id Uploaded file ID
     * @apiSuccess {String} url File access URL
     * @apiSuccess {String} name Original filename
     * @apiSuccess {String} mimeType File MIME type
     * @apiSuccess {Number} size File size in bytes
     * @apiSuccess {Date} uploadedAt Upload timestamp
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "file-uuid",
     *       "url": "https://example.com/files/image.jpg",
     *       "name": "image.jpg",
     *       "mimeType": "image/jpeg",
     *       "size": 1048576,
     *       "uploadedAt": "2025-06-11T10:00:00Z"
     *     }
     *
     * @apiUse FileUploadError
     *
     * @apiExample {curl} Example usage:
     *     curl -X POST \
     *       -H "Content-Type: multipart/form-data" \
     *       -F "file=@/path/to/file.jpg" \
     *       -F "type=profile" \
     *       https://api.example.com/upload
     */
    // this.router.post('/upload', [this.upload.bind(this)]);
  }

  //#region Admin section
  async upload(req: Request, res: Response) {
    return this.uploadService.upload(req, res);
  }
}
