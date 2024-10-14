import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ItemsModule, AuthModule],
})
export class AppModule {}
