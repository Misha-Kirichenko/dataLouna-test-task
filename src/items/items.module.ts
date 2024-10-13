import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { HttpModule } from '@nestjs/axios';
import { ItemsCacheService } from './itemsCache.service';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsCacheService],
})
export class ItemsModule { }
