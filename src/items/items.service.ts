import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { stringify, parse } from 'flatted';
import { ItemsQueryParamsDTO } from './dto';
import { HttpService } from '@nestjs/axios';
import { IModifiedItem } from './interfaces/modifiedItem.interface'; // Предполагается, что интерфейс находится здесь
import { TOriginalItem } from './types';

@Injectable()
export class ItemsService {
  private apiBaseUrl: string;
  constructor(private readonly httpService: HttpService) {
    this.apiBaseUrl = `https://api.skinport.com/v1/items`;
  }

  public async getItemsWithMinPrices(
    itemsQueryParams: ItemsQueryParamsDTO,
  ): Promise<IModifiedItem[]> {
    try {
      const queryString = this.generateQueryString(itemsQueryParams);

      const apiUrlForTradable = queryString.length
        ? `${this.apiBaseUrl}?${queryString}&tradable=1`
        : `${this.apiBaseUrl}?tradable=1`;

      const apiUrlForNonTradable = queryString.length
        ? `${this.apiBaseUrl}?${queryString}&tradable=0`
        : `${this.apiBaseUrl}?tradable=0`;

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
      );

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

      return items;
    } catch (error) {
      console.error('err', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Oops... Something went wrong!');
    }
  }

  private generateQueryString(itemsQueryParams: ItemsQueryParamsDTO): string {
    const params = [];
    for (const field in itemsQueryParams) {
      const queryFieldString = `${field}=${itemsQueryParams[field]}`;
      params.push(queryFieldString);
    }
    const queryString = `${params.length ? params.join('&') : ''}`;
    return queryString;
  }
}
