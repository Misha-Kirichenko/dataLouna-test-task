import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { ItemsService } from './items/items.service';
import { HttpModule } from '@nestjs/axios';
import { ItemsController } from './items/items.controller';

@Module({
  imports: [ItemsModule, HttpModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class AppModule {}
