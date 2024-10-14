import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { IModifiedItem } from './interfaces';
import { CreateItemDocs } from './docs/controller.decorator';
import { GET_ITEMS_DECORATORS, PURCHASE_ITEM_DECORATORS } from './docs';
import { QuantityDTO } from './dto/quantity.dto';
import { IAuthorizedRequest } from 'src/common/interfaces/authorizeRequest.interface';
import { AuthGuard } from 'src/common/guards';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @CreateItemDocs(GET_ITEMS_DECORATORS)
  @Get()
  getItems(): Promise<IModifiedItem[]> {
    return this.itemsService.getItemsWithMinPrices();
  }

  @CreateItemDocs(PURCHASE_ITEM_DECORATORS)
  @UseGuards(AuthGuard)
  @Post('/purchase/:id')
  purchaseItem(
    @Req() req: IAuthorizedRequest,
    @Param('id') id: string,
    @Body() quantityDTO: QuantityDTO,
  ) {
    const { id: user_id } = req.user;
    const itemPurchaseData = {
      id: Number(id),
      quantity: quantityDTO.quantity,
    };

    return this.itemsService.purchaseItem(user_id, itemPurchaseData);
  }
}
