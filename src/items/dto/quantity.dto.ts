import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuantityDTO {
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
