import { Request, Response } from 'express';
import { validate } from '../../common';
import { RouteConfig } from '../../libs';
import { SignTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';
import { AuthValidation } from './auth.validation';

export default class AuthController {
  private authService = new AuthService();
  private readonly router = RouteConfig;
  private readonly adminPath = '/admin/auth';
  private readonly userPath = '/auth';

  constructor() {
    this._initializeRoutes();
  }

  private _initializeRoutes() {
    //#region Admin section
    // this.router.post(`${this.adminPath}/login`, [
    //   validate(AuthValidation.adminLogin),
    //   this.adminLogin.bind(this),
    // ]);

    // this.router.post(`${this.adminPath}/logout`, [this.logout.bind(this)], {
    //   roles: Object.values(AppObject.ADMIN_ROLES),
    // });

    //#region User section
    // this.router.get(`${this.userPath}/login/socials/:social`, [
    //   this.socialLink.bind(this),
    // ]);

    /**
     * @api {post} /auth/login User Login
     * @apiName UserLogin
     * @apiGroup User Authentication
     *
     * @apiParam (Body) {String} email User email
     * @apiParam (Body) {String} password User password
     *
     * @apiSuccess {String} token JWT access token
     * @apiSuccess {String} refreshToken Refresh token
     * @apiSuccess {Object} user User details
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "jwt.token.here",
     *       "refreshToken": "refresh.token.here",
     *       "user": {
     *         "id": "uuid",
     *         "email": "user@example.com"
     *       }
     *     }
     */
    this.router.post(`${this.userPath}/login`, [this.login.bind(this)]);

    /**
     * @api {post} /auth/register User Registration
     * @apiName RegisterUser
     * @apiGroup User Authentication
     *
     * @apiParam (Body) {String} email User email
     * @apiParam (Body) {String} password User password
     * @apiParam (Body) {String} firstName User first name
     * @apiParam (Body) {String} lastName User last name
     *
     * @apiSuccess {String} message Registration success message
     * @apiSuccess {Object} user Created user details
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "message": "Registration successful",
     *       "user": {
     *         "id": "uuid",
     *         "email": "user@example.com"
     *       }
     *     }
     */
    this.router.post(`${this.userPath}/register`, [
      validate(AuthValidation.register),
      this.register.bind(this),
    ]);

    /**
     * @api {post} /auth/verify-account/resend Resend Verification OTP
     * @apiName ResendVerificationOTP
     * @apiGroup User Authentication
     *
     * @apiParam (Body) {String} email User email address
     *
     * @apiSuccess {String} message OTP resend confirmation
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message": "Verification code sent successfully"
     *     }
     */
    // this.router.post(`${this.userPath}/verify-account/resend`, [
    //   validate(AuthValidation.resendVerifyAccount),
    //   this.resendOtp.bind(this),
    // ]);

    /**
     * @api {post} /auth/verify-account Verify Account
     * @apiName VerifyAccount
     * @apiGroup User Authentication
     *
     * @apiParam (Body) {String} email User email
     * @apiParam (Body) {String} code Verification code
     *
     * @apiSuccess {String} message Verification success message
     * @apiSuccess {Object} user Verified user details
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message": "Account verified successfully",
     *       "user": {
     *         "id": "uuid",
     *         "email": "user@example.com",
     *         "verified": true
     *       }
     *     }
     */
    this.router.post(`${this.userPath}/verify-account`, [
      validate(AuthValidation.verifyAccount),
      this.verify.bind(this),
    ]);

    /**
     * @api {post} /auth/refresh Refresh Token
     * @apiName RefreshToken
     * @apiGroup User Authentication
     *
     * @apiParam (Body) {String} refreshToken Current refresh token
     *
     * @apiSuccess {String} token New JWT access token
     * @apiSuccess {String} refreshToken New refresh token
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "new.jwt.token",
     *       "refreshToken": "new.refresh.token"
     *     }
     */
    this.router.post(`${this.userPath}/refresh`, [
      this.refreshToken.bind(this),
    ]);

    /**
     * @api {post} /auth/logout User Logout
     * @apiName UserLogout
     * @apiGroup User Authentication
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess {Boolean} success Logout status
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true
     *     }
     */
    this.router.post(`${this.userPath}/logout`, [this.logout.bind(this)], {
      allowAnonymous: false,
    });
  }

  //#region Admin section
  async adminLogin(req: Request, res: Response): Promise<SignTokenResponse> {
    return res.handler(this.authService.adminLogin({ body: req.body }));
  }
  //#endregion Admin section

  //#region User section
  async socialLink(req: Request, res: Response) {
    return res.handler(this.authService.socialLink(res, req.params.social));
  }

  async login(req: Request, res: Response): Promise<SignTokenResponse> {
    return res.handler(this.authService.login({ body: req.body }));
  }

  async verify(req: Request, res: Response): Promise<SignTokenResponse> {
    return res.handler(this.authService.verify({ body: req.body }));
  }

  async resendOtp(req: Request, res: Response): Promise<SignTokenResponse> {
    return res.handler(this.authService.resendOtp({ body: req.body }));
  }

  async refreshToken(req: Request, res: Response): Promise<SignTokenResponse> {
    return res.handler(this.authService.refreshToken(req.body.refreshToken));
  }

  async register(req: Request, res: Response) {
    return res.handler(this.authService.register(req.body));
  }

  async logout(req: Request, res: Response) {
    return res.handler(this.authService.logout(req.user));
  }
  //#endregion User section
}
