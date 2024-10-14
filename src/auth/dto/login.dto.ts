import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'example@mail.com' })
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Default_123' })
  @IsDefined()
  @IsNotEmpty()
  password: string;
}
