import { Injectable } from '@nestjs/common';
import { ItemDto } from './dto/create-item.dto';
import { ItemsRepository } from './items.repository';
import { QueryItemsDto } from './dto/query-items.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  async findAll(queryDto: QueryItemsDto): Promise<ItemDto[]> {
    const { limit = 10, offset = 0 } = queryDto;

    return this.itemsRepository.findMany(limit, offset);
  }
}
