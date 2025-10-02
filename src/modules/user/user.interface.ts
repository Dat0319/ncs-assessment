// export interface IUser extends Document {
//   _id: string;
//   phoneNumber: {
//     dialCode: string;
//     phone: string;
//     fullPhone: string;
//   };
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   salt: string;
//   status: string;
//   comparePassword: (password: string) => Promise<boolean>;
// }

import { User } from './user.entity';

export type UserModel = User;

export interface RegisterAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResendVerifyAccount {
  email: string;
}

export interface VerifyAccount {
  email: string;
  otp: string;
}

export interface PhoneNumberProperties {
  phone: string;
  dialCode: string;
}

export interface UserLoginParams {
  email?: string;
  password?: string;
  grantType: string;
}

export type UpdateUserProfileParams = Partial<
  Pick<UserModel, 'firstName' | 'lastName' | 'dateOfBirth' | 'mobilePhone'>
>;

export interface TeacherRegisterParams {
  teacher: string;
  students: string[];
}

export interface StudentCommonParams {
  teachers: string[];
}

export interface StudentSuspendParams {
  email: string;
}
