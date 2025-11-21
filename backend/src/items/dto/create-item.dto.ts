import {
  minLength,
  object,
  string,
  number,
  integer,
  pipe,
  InferInput,
  date,
  omit,
} from 'valibot';
import { items } from '../entities/item.entity';

export const itemsSchema = object({
  id: pipe(
    number('id должен быть числом'),
    integer('id должен быть целым числом'),
  ),
  name: pipe(
    string('Вы не указали Имя'),
    minLength(1, 'Должно состоять минимум из 1 символа'),
  ),
  createdAt: date(),
});

export const createItemsSchema = omit(itemsSchema, ['id', 'createdAt']);

export type ItemDto = typeof items.$inferSelect;
export type CreateItemDto = typeof items.$inferInsert;
