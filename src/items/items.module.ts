import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { HttpModule } from '@nestjs/axios';
import { ItemsCacheService } from './itemsCache.service';
import { QueryBuilderService } from 'src/common/services/queryBuilder.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController],
  providers: [ItemsService, JwtService, ItemsCacheService, QueryBuilderService],
})
export class ItemsModule { }
