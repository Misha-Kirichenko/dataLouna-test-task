import {
  ApiBadRequestResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ERROR_MESSAGES } from '../constants';

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
  ApiTooManyRequestsResponse({
    schema: {
      type: 'object',
      example: {
        errors: [
          {
            id: 'rate_limit_exceeded',
            message: 'Your connection is being rate limited.',
          },
        ],
      },
      description: 'Unexpected error',
    },
  }),
];
