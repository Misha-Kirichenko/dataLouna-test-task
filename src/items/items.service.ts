import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { stringify, parse } from 'flatted';
import { HttpService } from '@nestjs/axios';
import { IModifiedItem } from './interfaces/modifiedItem.interface'; // Предполагается, что интерфейс находится здесь
import { TOriginalItem } from './types';
import { ItemsCacheService } from './itemsCache.service';
import { ERROR_MESSAGES } from 'src/common/constants';

@Injectable()
export class ItemsService {
  private apiBaseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly itemsCacheService: ItemsCacheService,
  ) {
    this.apiBaseUrl = `https://api.skinport.com/v1/items`;
  }

  public async getItemsWithMinPrices(): Promise<IModifiedItem[]> {
    try {
      const cachedItems = await this.itemsCacheService.getCachedItems();

      //get items from redis if they exist
      if (cachedItems) {
        console.log('got cached items', true);
        return cachedItems;
      }

      //create modified collection, return it, but cache it before returning

      const apiUrlForTradable = `${this.apiBaseUrl}?tradable=1`;
      const apiUrlForNonTradable = `${this.apiBaseUrl}?tradable=0`;

      const reqForTradable = this.httpService.get(`${apiUrlForTradable}`);
      const reqForNonTradable = this.httpService.get(`${apiUrlForNonTradable}`);

      const [tradableItemsResponse, nonTradebleItemsResponse] =
        await Promise.all([
          lastValueFrom(reqForTradable),
          lastValueFrom(reqForNonTradable),
        ]);

      const tradableItems = parse(stringify(tradableItemsResponse.data));
      const nonTradableItems = parse(stringify(nonTradebleItemsResponse.data));

      const nonTradableMap = nonTradableItems.reduce(
        (acc: object, item: TOriginalItem) => {
          acc[item.market_hash_name] = item;
          return acc;
        },
        {} as Record<string, TOriginalItem>,
      ); //create hash-map where key is market_hash_name, to match objects faster.

      const items: IModifiedItem[] = tradableItems.map(
        (tradableItem: TOriginalItem) => {
          const nonTradableItem = nonTradableMap[tradableItem.market_hash_name];

          return {
            market_hash_name: tradableItem.market_hash_name,
            currency: tradableItem.currency,
            suggested_price: tradableItem.suggested_price,
            item_page: tradableItem.item_page,
            market_page: tradableItem.market_page,
            min_tradable_price: tradableItem.min_price,
            min_non_tradable_price: nonTradableItem
              ? nonTradableItem.min_price
              : null,
            max_price: tradableItem.max_price,
            mean_price: tradableItem.mean_price,
            quantity: tradableItem.quantity,
            created_at: tradableItem.created_at,
            updated_at: tradableItem.updated_at,
          };
        },
      );

      await this.itemsCacheService.cacheItems(items);

      return items;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(ERROR_MESSAGES.badRequest);
    }
  }
}
