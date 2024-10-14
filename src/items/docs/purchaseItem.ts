import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ITEM_NOT_FOUND_EXAMPLE, ITEM_PURCHASED_EXAMPLE } from './example';

export const PURCHASE_ITEM_DECORATORS = [
  ApiBearerAuth(),
  ApiCreatedResponse({
    schema: {
      example: ITEM_PURCHASED_EXAMPLE,
    },
  }),
  ApiNotFoundResponse({
    schema: {
      example: ITEM_NOT_FOUND_EXAMPLE,
    },
  }),
];
