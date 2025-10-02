import { JSONSchemaType } from 'ajv';
import {
  StudentCommonParams,
  StudentSuspendParams,
  TeacherRegisterParams,
  UpdateUserProfileParams,
} from './user.interface';

export const UserValidation = {
  updateProfile: {
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', nullable: true },
        lastName: { type: 'string', nullable: true },
        dateOfBirth: { type: 'string', nullable: true },
        mobilePhone: {
          type: 'object',
          nullable: true,
          properties: {
            dialCode: { type: 'string' },
            phone: { type: 'string' },
          },
          required: ['dialCode', 'phone'],
        },
      },
      additionalProperties: false,
      errorMessage: {},
    } as JSONSchemaType<UpdateUserProfileParams>,
  },
};

export const TeacherValidation = {
  register: {
    body: {
      type: 'object',
      properties: {
        teacher: {
          type: 'string',
          format: 'email',
        },
        students: {
          type: 'array',
          items: {
            type: 'string',
            format: 'email',
          },
          minItems: 1,
          uniqueItems: true,
        },
      },
      required: ['teacher', 'students'],
      additionalProperties: false,
      errorMessage: {
        properties: {
          teacher: 'teacher must be a valid email',
          students: 'students must be an array of unique emails',
        },
        required: {
          teacher: 'teacher is required',
          students: 'students is required',
        },
      },
    } as JSONSchemaType<TeacherRegisterParams>,
  },
};

export const StudentValidation = {
  common: {
    query: {
      type: 'object',
      properties: {
        teachers: {
          anyOf: [
            {
              type: 'array',
              items: { type: 'string', format: 'email' },
              minItems: 1,
              uniqueItems: true,
            },
            {
              type: 'string',
              format: 'email',
            },
          ],
          errorMessage: {
            anyOf:
              'teachers must be a valid email or an array of unique emails',
          },
        },
      },
      required: ['teachers'],
      additionalProperties: false,
      errorMessage: {
        required: {
          teachers: 'teachers is required',
        },
      },
    } as JSONSchemaType<StudentCommonParams>,
  },
  suspend: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          errorMessage: {
            type: 'mustBeString',
            format: 'mustBeValidEmail',
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
    } as JSONSchemaType<StudentSuspendParams>,
  },
};
