import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { QueryBuilderService } from 'src/common/services/queryBuilder.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, QueryBuilderService],
})
export class AuthModule { }
