import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { createItemsSchema, type CreateItemDto } from './dto/create-item.dto';
import { ValibotPipe } from 'src/pipes/valibot.pipe';
import { QueryItemsDto } from './dto/query-items.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  // @UsePipes(new ValibotPipe(QueryItemsSchema))
  findAll(
    @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const queryData = { limit, offset };

    return this.itemsService.findAll({ limit, offset });
  }
}
