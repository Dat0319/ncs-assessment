import { Role } from './role.entity';

export type RoleModel = Role;

export interface CreateRoleParams {
  products: {
    id: string;
    productAttributes: {
      id: string;
      quantity: number;
    }[];
  }[];
  shippingAddress: {
    city: string;
    district: string;
    ward: string;
    street: string;
  };
}
