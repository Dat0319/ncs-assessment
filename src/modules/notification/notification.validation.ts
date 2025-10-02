/**
 * Notification Validator
 * @module Notification Validator
 * @description Config validator
 */

import { JSONSchemaType } from 'ajv';
import { NotificationRecipientParams } from './notification.model';

export const NotificationValidation = {
  recipient: {
    body: {
      type: 'object',
      properties: {
        teacher: {
          type: 'string',
          format: 'email',
          errorMessage: {
            type: 'mustBeString',
            format: 'mustBeValidEmail',
          },
        },
        notification: {
          type: 'string',
          minLength: 1,
          errorMessage: {
            type: 'mustBeString',
            minLength: 'mustBeMinLength',
          },
        },
      },
      required: ['teacher', 'notification'],
      additionalProperties: false,
      errorMessage: {
        required: {
          teacher: 'teacherIsRequired',
          notification: 'notificationIsRequired',
        },
      },
    } as JSONSchemaType<NotificationRecipientParams>,
  },
};
