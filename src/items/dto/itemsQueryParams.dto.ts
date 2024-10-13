import { IsIn, IsInt, IsOptional } from 'class-validator';
import { Currency } from '../enums';
import { Type } from 'class-transformer';

export class ItemsQueryParamsDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  app_id: number;

  @IsOptional()
  @IsIn(Object.values(Currency))
  currency: Currency;
}
