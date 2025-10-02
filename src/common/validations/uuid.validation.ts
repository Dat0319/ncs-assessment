import { JSONSchemaType } from 'ajv';

export const UUIDValidation = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
    required: ['id'],
    additionalProperties: false,
    errorMessage: {
      properties: {
        id: 'idInvalid',
      },
    },
  } as JSONSchemaType<{ id: string }>,
};
