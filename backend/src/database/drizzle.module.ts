import { Global, Module } from '@nestjs/common';
import { db } from './drizzle.provider';

export const drizzleProviderKey = 'DRIZZLE';

@Global()
@Module({
  providers: [
    {
      provide: drizzleProviderKey,
      useValue: db,
    },
  ],
  exports: [drizzleProviderKey],
})
export class DrizzleModule {}
