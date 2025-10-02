import { Response } from 'express';
import got from 'got';
import qs from 'query-string';
import { getCustomRepository } from 'typeorm';
import { AppObject } from '../../common/consts';
import APP_CONFIG from '../../configs/app.config';
import RedisConfig from '../../configs/databases/redis.config';
import MailService from '../../external-services/mail/mail.service';
import { ErrorHandler, UnauthorizedError } from '../../libs/errors';
import { StringUtil } from '../../utils';
import { CacheManagerUtil } from '../../utils/cache-manager.util';
import { TokenUtil } from '../../utils/token.util';
import { AdminModel } from '../admin/admin.model';
import { AdminService } from '../admin/admin.service';
import { UserModel, VerifyAccount } from '../user/user.interface';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import {
  AdminLoginParams,
  FacebookData,
  GoogleData,
  LoginParams,
  RegisterParams,
  SignTokenResponse,
  TokenPayload,
} from './auth.interface';

export class AuthService {
  private static instance: AuthService;
  private userService: UserService;
  private tokenUtil: TokenUtil;
  private userRepository: UserRepository;
  private cacheManager: CacheManagerUtil;
  private adminService: AdminService;
  private mailService: MailService;

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }

    this.userService = new UserService();
    this.adminService = new AdminService();
    this.mailService = new MailService();
    this.tokenUtil = new TokenUtil();
    this.userRepository = getCustomRepository(UserRepository);
    this.cacheManager = new CacheManagerUtil(RedisConfig.client);
    AuthService.instance = this;
  }

  async socialLink(res: Response, social: string) {
    let link: string;
    switch (social) {
      case AppObject.GRANT_TYPES.GOOGLE:
        link = `https://accounts.google.com/o/oauth2/auth?${qs.stringify({
          client_id:
            APP_CONFIG.ENV.OAUTH2[AppObject.GRANT_TYPES.GOOGLE.toUpperCase()]
              .CLIENT_ID,
          redirect_uri: 'http://localhost:5173/',
          scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            // 'https://www.googleapis.com/auth/userinfo.email',
          ].join(' '),
          response_type: 'code',
          access_type: 'offline',
        })}`;
        break;
      case AppObject.GRANT_TYPES.FACEBOOK:
      default:
        link = `https://www.facebook.com/v15.0/dialog/oauth?${qs.stringify({
          client_id:
            APP_CONFIG.ENV.OAUTH2[AppObject.GRANT_TYPES.FACEBOOK.toUpperCase()]
              .CLIENT_ID,
          redirect_uri: 'http://localhost:5173/',
          scope: ['public_profile'].join(','),
          response_type: 'code',
        })}`;
        break;
    }
    return { link };
  }

  async login(params: { body: LoginParams }) {
    let userFound: UserModel;

    switch (params.body.grantType) {
      case AppObject.GRANT_TYPES.FACEBOOK: {
        const fbAccessToken: { access_token: string } = await got(
          'https://graph.facebook.com/v15.0/oauth/access_token',
          {
            method: 'GET',
            searchParams: {
              client_id:
                APP_CONFIG.ENV.OAUTH2[
                  AppObject.GRANT_TYPES.FACEBOOK.toUpperCase()
                ].CLIENT_ID,
              client_secret:
                APP_CONFIG.ENV.OAUTH2[
                  AppObject.GRANT_TYPES.FACEBOOK.toUpperCase()
                ].CLIENT_SECRET,
              redirect_uri: 'http://localhost:5173/',
              code: params.body.code,
            },
          }
        ).json();
        const facebookData: FacebookData = await got(
          'https://graph.facebook.com/me',
          {
            method: 'GET',
            searchParams: {
              fields: ['id', 'first_name', 'last_name'].join(','),
              access_token: fbAccessToken.access_token,
            },
          }
        ).json();
        userFound = await this.userService.getUserByFacebookId(facebookData);
        break;
      }
      case AppObject.GRANT_TYPES.GOOGLE: {
        const data: { access_token: string } = await got(
          'https://oauth2.googleapis.com/token',
          {
            method: 'POST',
            searchParams: {
              client_id:
                APP_CONFIG.ENV.OAUTH2[
                  AppObject.GRANT_TYPES.GOOGLE.toUpperCase()
                ].CLIENT_ID,
              client_secret:
                APP_CONFIG.ENV.OAUTH2[
                  AppObject.GRANT_TYPES.GOOGLE.toUpperCase()
                ].CLIENT_SECRET,
              redirect_uri: 'http://localhost:5173/',
              grant_type: 'authorization_code',
              code: params.body.code,
            },
          }
        ).json();
        const googleData: GoogleData = await got(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${data.access_token}` },
          }
        ).json();

        userFound = await this.userService.getUserByGoogleId(googleData);
        break;
      }
      default: {
        userFound = await this.userService.getUserByConditions({
          conditions: { email: params.body.email },
          select: ['id', 'password', 'status'],
        });
        if (!userFound.comparePassword(params.body.password)) {
          throw new ErrorHandler({ message: 'wrongPassword' });
        }
        break;
      }
    }

    return this._signToken({ id: userFound.id });
  }

  async adminLogin(params: {
    body: AdminLoginParams;
  }): Promise<SignTokenResponse> {
    const admin: AdminModel = await this.adminService.login(params.body);
    return this._signToken({ id: admin.id }, true);
  }

  async resendOtp(params: { body: VerifyAccount }) {
    const userFound = await this.userService.detailByConditions({
      conditions: { email: params.body.email },
      select: ['status', 'id'],
    });

    if (!userFound) {
      throw new ErrorHandler({ message: 'userNotFound' });
    }

    if (userFound.status !== AppObject.USER_STATUS.UNVERIFIED) {
      throw new ErrorHandler({ message: 'accountVerified' });
    }

    const otpDoc = await this.cacheManager.getKey(
      `caches:users:${userFound.id}:verify-account`
    );

    const times: number = otpDoc ? (otpDoc.times as number) : 0;

    if (times + 1 > 5) {
      throw new ErrorHandler({ message: 'limitResendOtp' });
    }

    await this.cacheManager.setKey({
      key: `caches:users:${userFound.id}:verify-account`,
      value: JSON.stringify({
        otp: StringUtil.randomNumber(6),
        times: times + 1,
      }),
      exp: 3 * 60,
    });

    return { isSuccess: 1 };
  }

  async verify(params: { body: VerifyAccount }) {
    const userFound = await this.userService.detailByConditions({
      conditions: { email: params.body.email },
      select: ['id', 'status'],
    });

    if (!userFound) {
      throw new ErrorHandler({ message: 'userNotFound' });
    }

    if (userFound.status !== AppObject.USER_STATUS.UNVERIFIED) {
      throw new ErrorHandler({ message: 'accountVerified' });
    }

    const otpDoc = await this.cacheManager.getKey(
      `caches:users:${userFound.id}:verify-account`
    );

    if (!otpDoc || otpDoc.otp !== params.body.otp) {
      throw new ErrorHandler({ message: 'otpInvalid' });
    }

    this.userRepository.updateByConditions({
      conditions: { id: userFound.id },
      data: { status: AppObject.COMMON_STATUS.ACTIVE },
    });

    return this._signToken({ id: userFound.id });
  }

  async register(params: RegisterParams) {
    const user = await this.userService.create(params);
    const otp = StringUtil.randomNumber(6);
    await this.cacheManager.setKey({
      key: `caches:users:${user.id}:verify-account`,
      value: JSON.stringify({ otp: otp, times: 1 }),
      exp: 3 * 60,
    });

    await this.mailService.send({
      subject: 'Verify your account',
      to: [params.email],
      content: `Your OTP code is: ${otp}`,
    });

    return { succeed: true };
  }

  async loginGoogle(params) {
    // const data: { access_token: string } = await got(
    //   'https://oauth2.googleapis.com/token',
    //   {
    //     method: 'POST',
    //     searchParams: {
    //       client_id:
    //         '',
    //       client_secret: '',
    //       redirect_uri: 'http://localhost:8080/api/v1/auth/google',
    //       grant_type: 'authorization_code',
    //       code: params.code,
    //     },
    //   }
    // ).json();
    // const googleData = await got(
    //   'https://www.googleapis.com/oauth2/v2/userinfo',
    //   {
    //     method: 'GET',
    //     headers: { Authorization: `Bearer ${data.access_token}` },
    //   }
    // ).json();
    // try {
    //   const googleData2: any = await got(
    //     `https://oauth2.googleapis.com/tokeninfo?id_token=${data.id_token}`,
    //     {
    //       method: 'POST',
    //       // headers: {
    //       //   Authorization: `Bearer ${data.access_token}`,
    //       // },
    //     }
    //   ).json();
    //   // const t = await got(
    //   //   `https://people.googleapis.com/v1/people/${googleData.id}`,
    //   //   {
    //   //     method: 'GET',
    //   //     searchParams: { personFields: ['birthdays', 'genders'].join(',') },
    //   //     headers: { Authorization: `Bearer ${data.access_token}` },
    //   //   }
    //   // );
    //   return googleData2;
    // } catch (error) {
    //   console.log(error);
    // }
    return params;
  }

  async refreshToken(token: string) {
    const payload = this.tokenUtil.verifyRefreshToken(token);
    const tokenKey = await this.cacheManager.getKey(
      `caches:users:${payload.id}:refreshTokens:${payload.signedKey}`
    );

    if (!tokenKey) {
      throw new UnauthorizedError();
    }

    return this._signToken(payload);
  }

  async logout(user: Express.TokenModel) {
    this.cacheManager.client.keys(
      `caches:${
        user.role === AppObject.CUSTOMER_ROLES.CUSTOMER ? 'users' : 'admins'
      }:${user.id}:*`,
      (_err, data) => {
        if (data.length > 0) {
          this.cacheManager.delKey(data);
        }
      }
    );

    return { succeed: true };
  }

  private _signToken(
    payload: TokenPayload,
    isAdmin = false
  ): SignTokenResponse {
    if (isAdmin) {
      this.adminService
        .detailByConditions({ conditions: { id: payload.id } })
        .then((data) => {
          this.cacheManager.setKey({
            key: `caches:profiles:${payload.id}`,
            value: JSON.stringify(data),
            exp: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME,
          });
        });
    } else {
      this.userService
        .detailByConditions({ conditions: { id: payload.id } })
        .then((data) => {
          this.cacheManager.setKey({
            key: `caches:profiles:${payload.id}`,
            value: JSON.stringify(data),
            exp: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME,
          });
        });
      this.userService.updateByConditions({
        conditions: { id: payload.id },
        data: { lastLogin: new Date() },
      });
    }

    this.userRepository
      .findOne({
        where: { id: payload.id, isDeleted: false },
        relations: ['roles'],
      })
      .then((user) => {
        if (user) {
          const roles = (user.roles ?? [])
            .filter((role) => !role.isDeleted)
            .map((role) => role.code);

          this.cacheManager.setKey({
            key: `caches:roles:${payload.id}`,
            value: JSON.stringify(roles),
            exp: APP_CONFIG.ENV.SECURE.JWT_ACCESS_TOKEN.EXPIRED_TIME,
          });
        }
      });

    return this.tokenUtil.sign(payload, isAdmin);
  }
}
