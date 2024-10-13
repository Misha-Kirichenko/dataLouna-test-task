import { ApiOkResponse } from '@nestjs/swagger';
import { ITEMS_EXAMPLE } from './example';

export const GET_ITEMS_DECORATORS = [
  ApiOkResponse({
    schema: {
      example: ITEMS_EXAMPLE,
    },
  }),
];
