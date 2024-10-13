import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsQueryParamsDTO } from './dto';
import { IModifiedItem } from './interfaces';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getItems(
    @Query() itemsQueryParams: ItemsQueryParamsDTO,
  ): Promise<IModifiedItem[]> {
    return this.itemsService.getItemsWithMinPrices(itemsQueryParams);
  }
}
