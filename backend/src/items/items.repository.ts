import { Injectable, Inject } from '@nestjs/common';
import { items } from './entities/item.entity';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleProviderKey } from 'src/database/drizzle.module';
import { ItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsRepository {
  constructor(
    @Inject(drizzleProviderKey)
    private readonly db: NodePgDatabase,
  ) {}

  async findMany(limit: number, offset: number): Promise<ItemDto[]> {
    return await this.db
      .select({
        id: items.id,
        name: items.name,
        createdAt: items.createdAt,
      })
      .from(items)
      .orderBy(items.id)
      .limit(limit)
      .offset(offset);
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(items);
  }
}
