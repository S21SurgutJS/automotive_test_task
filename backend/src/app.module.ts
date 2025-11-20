import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [ItemsModule, DrizzleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
