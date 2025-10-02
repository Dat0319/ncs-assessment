import { JSONSchemaType } from 'ajv';
import {
  RegisterAccount,
  ResendVerifyAccount,
  VerifyAccount,
} from '../user/user.interface';
import { AdminLoginParams } from './auth.interface';

export const AuthValidation = {
  adminLogin: {
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
      },
      required: ['email', 'password'],
      additionalProperties: false,
      errorMessage: {
        required: {
          email: 'emailIsRequired',
          password: 'passwordIsRequired',
        },
      },
    } as JSONSchemaType<AdminLoginParams>,
  },
  register: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          minLength: 5,
          errorMessage: {
            type: 'mustString',
            minLength: 'min length',
          },
        },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
      required: ['email', 'password', 'firstName', 'lastName'],
      additionalProperties: false,
      errorMessage: {
        required: {
          firstName: 'firstNameIsRequired',
          lastName: 'lastNameIsRequired',
          email: 'emailIsRequired',
          password: 'passwordIsRequired',
        },
      },
    } as JSONSchemaType<RegisterAccount>,
  },
  verifyAccount: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          minLength: 5,
          errorMessage: {
            type: 'mustString',
            minLength: 'min length',
          },
        },
        otp: { type: 'string' },
      },
      required: ['email', 'otp'],
      additionalProperties: false,
      errorMessage: {
        required: {
          email: 'emailIsRequired',
        },
      },
    } as JSONSchemaType<VerifyAccount>,
  },
  resendVerifyAccount: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          minLength: 5,
          errorMessage: {
            type: 'mustString',
            minLength: 'min length',
          },
        },
      },
      required: ['email'],
      additionalProperties: false,
      errorMessage: {
        required: {
          email: 'emailIsRequired',
        },
      },
    } as JSONSchemaType<ResendVerifyAccount>,
  },
};
