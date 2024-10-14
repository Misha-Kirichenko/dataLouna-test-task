import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ERROR_MESSAGES } from 'src/common/constants';

export const COMMON_RESPONSES = [
  ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: ERROR_MESSAGES.badRequest,
        error: 'Bad Request',
        statusCode: 400,
      },
      description: 'Unexpected error',
    },
  }),
];
