import { PhoneNumberProperties } from '../user/user.interface';
import { Admin } from './admin.entity';

export type AdminModel = Admin;

export interface CreateAdminParams {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobilePhone?: PhoneNumberProperties;
  gender: string;
}
