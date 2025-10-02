import { PhoneNumberProperties } from '../user/user.interface';

export interface FacebookData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
}

export interface GoogleData {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
}

export interface LoginParams {
  grantType: string;
  username: string;
  password: string;
  code?: string;
  mobilePhone?: PhoneNumberProperties;
  email?: string;
}

export interface AdminLoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  mobilePhone?: PhoneNumberProperties;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  [key: string]: string | boolean | number;
}

export interface SignTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiredTime: number;
}
