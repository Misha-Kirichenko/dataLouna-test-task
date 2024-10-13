import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';
import { IModifiedItem } from './interfaces';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Get()
  getItems(): Promise<IModifiedItem[]> {
    return this.itemsService.getItemsWithMinPrices();
  }
}
