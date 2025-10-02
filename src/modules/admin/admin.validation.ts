import { JSONSchemaType } from 'ajv';
import { AppObject } from '../../common/consts';
import { CreateAdminParams } from './admin.model';

export const AdminValidation = {
  create: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          minLength: 5,
          errorMessage: { type: 'mustString', minLength: 'min length' },
        },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string', enum: Object.values(AppObject.ADMIN_ROLES) },
        mobilePhone: {
          type: 'object',
          properties: {
            dialCode: { type: 'string' },
            phone: { type: 'string' },
          },
          required: ['dialCode', 'phone'],
          nullable: true,
        },
        gender: { type: 'string', enum: Object.values(AppObject.GENDER) },
      },
      required: [
        'email',
        'firstName',
        'lastName',
        'role',
        'password',
        'gender',
      ],
      additionalProperties: false,
      errorMessage: {
        // required: {
        //   email: 'emailIsRequired',
        //   password: 'passwordIsRequired',
        // },
      },
    } as JSONSchemaType<CreateAdminParams>,
  },
};
