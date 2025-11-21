import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ItemsService } from './items.service';
import { type CreateItemDto, createItemsSchema } from './dto/create-item.dto';
import { ValibotPipe } from 'src/pipes/valibot.pipe';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Post('create')
  @UsePipes(new ValibotPipe(createItemsSchema))
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }
}
