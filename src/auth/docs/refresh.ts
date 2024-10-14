import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TOKENS_PAIR, UNAUTHORIZED } from './example';

export const REFRESH_DECORATORS = [
  ApiBearerAuth(),
  ApiOkResponse({
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
