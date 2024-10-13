import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';
import { IModifiedItem } from './interfaces';
import { CreateItemDocs } from './docs/controller.decorator';
import { GET_ITEMS_DECORATORS } from './docs/getItems';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @CreateItemDocs(GET_ITEMS_DECORATORS)
  @Get()
  getItems(): Promise<IModifiedItem[]> {
    return this.itemsService.getItemsWithMinPrices();
  }
}
