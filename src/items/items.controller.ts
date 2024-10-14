import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { IModifiedItem } from './interfaces';
import { CreateItemDocs } from './docs/controller.decorator';
import { GET_ITEMS_DECORATORS } from './docs/getItems';
import { ApiTags } from '@nestjs/swagger';
import { QuantityDTO } from './dto/quantity.dto';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @CreateItemDocs(GET_ITEMS_DECORATORS)
  @Get()
  getItems(): Promise<IModifiedItem[]> {
    return this.itemsService.getItemsWithMinPrices();
  }

  @Post('purchase/:market_hash_name')
  purchaseItem(
    @Param('id') market_hash_name: string,
    @Body() quantityDTO: QuantityDTO,
  ) {
    const itemPurchaseData = {
      market_hash_name,
      quantity: quantityDTO.quantity,
    };

    return this.itemsService.purchaseItem(itemPurchaseData);
  }
}
