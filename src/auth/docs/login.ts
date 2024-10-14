import { ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TOKENS_PAIR, UNAUTHORIZED } from './example';

export const LOGIN_DECORATORS = [
  ApiCreatedResponse({
    schema: {
      example: TOKENS_PAIR,
    },
  }),
  ApiUnauthorizedResponse({
    schema: {
      example: UNAUTHORIZED,
    },
  }),
];
