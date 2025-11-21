import { drizzle } from 'drizzle-orm/node-postgres';
import { items } from '../items/entities/item.entity';
import { count, sql } from 'drizzle-orm';
import { Client } from 'pg';
import Config from '../../drizzle.config';
import { CreateItemDto } from 'src/items/dto/create-item.dto';
// import postgres from 'postgres';

const TOTAL_ITEMS = 50000;
const BATCH_SIZE = 1000;

async function seed() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // const connectionString = `postgresql://${process.env.DB_USERNAME || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'items_db'}`;

  const client = new Client({ ...Config.dbCredentials });

  try {
    await client.connect();
    const db = drizzle(client);
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(items);

    if (totalCount >= TOTAL_ITEMS) {
      console.log(`ℹ️  В базе уже ${totalCount} записей. Пропускаем seed.`);
      await client.end();
      return;
    }

    console.log(`📊 Текущее количество записей: ${totalCount}`);
    console.log(`🎯 Целевое количество: ${TOTAL_ITEMS}`);

    // Опционально: очистка таблицы
    // await db.delete(items);
    // console.log('🗑️  Таблица очищена');

    // Заполняем данными батчами
    const totalBatches = Math.ceil(TOTAL_ITEMS / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
      const itemsToInsert: CreateItemDto[] = [];
      const itemsInBatch = Math.min(
        BATCH_SIZE,
        TOTAL_ITEMS - batch * BATCH_SIZE,
      );

      for (let i = 0; i < itemsInBatch; i++) {
        const itemNumber = batch * BATCH_SIZE + i + 1;
        // const randomDate = new Date(
        //   Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        // );

        itemsToInsert.push({
          name: `Item ${itemNumber}`,
          // createdAt: randomDate,
        });
      }

      await db.insert(items).values(itemsToInsert);

      const progress = (((batch + 1) / totalBatches) * 100).toFixed(1);
      console.log(
        `⏳ Прогресс: ${progress}% (${Math.min((batch + 1) * BATCH_SIZE, TOTAL_ITEMS)}/${TOTAL_ITEMS})`,
      );
    }

    // Финальная проверка
    const [{ finalCount }] = await db
      .select({ finalCount: count() })
      .from(items);

    console.log('✅ Заполнение завершено!');
    console.log(`📈 Всего записей в базе: ${finalCount}`);
  } catch (error) {
    console.error('❌ Ошибка при заполнении базы:', error);
  } finally {
    await client.end();
    process.exit(1);
  }
}

seed();
