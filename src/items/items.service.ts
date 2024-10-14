import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { stringify, parse } from 'flatted';
import { HttpService } from '@nestjs/axios';
import { IModifiedItem, IItemPurchaseData } from './interfaces'; // Предполагается, что интерфейс находится здесь
import { TOriginalItem } from './types';
import { ItemsCacheService } from './itemsCache.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';
import { QueryBuilderService } from 'src/common/services/queryBuilder.service';
import { SqlIsolationLevel } from 'src/common/enums/sqlIsolationLevel.enum';
import { PoolClient } from 'pg';

@Injectable()
export class ItemsService {
  private apiBaseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly itemsCacheService: ItemsCacheService,
    private readonly queryBuilderService: QueryBuilderService,
  ) {
    this.apiBaseUrl = `https://api.skinport.com/v1/items`;
  }

  public async getItemsWithMinPrices(): Promise<IModifiedItem[]> {
    try {
      const cachedItems = await this.itemsCacheService.getCachedItems();

      //get items from redis if they exist
      if (cachedItems) {
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

  public async purchaseItem(
    user_id: number,
    itemPurchaseData: IItemPurchaseData,
  ): Promise<{ message: string }> {
    let client: PoolClient;
    try {
      client = await this.queryBuilderService.conn.connect();
      await client.query(
        `SET TRANSACTION ISOLATION LEVEL ${SqlIsolationLevel.REPEATABLE_READ}`,
      );
      const { id, quantity } = itemPurchaseData;

      const foundItemRawData = await client.query(
        `SELECT id, quantity, suggested_price FROM items WHERE id = $1 FOR UPDATE`,
        [id],
      );

      const [foundItem] = foundItemRawData.rows;

      if (!foundItem) throw new NotFoundException(ERROR_MESSAGES.itemNotFound);

      if (foundItem.quantity < quantity) {
        throw new BadRequestException(ERROR_MESSAGES.notEnoughItems);
      }

      const userRawData = await client.query(
        `SELECT id, balance FROM users WHERE id = $1 FOR UPDATE`,
        [user_id],
      );

      const [user] = userRawData.rows;

      if (!user) throw new NotFoundException(ERROR_MESSAGES.userNotFound);

      const totalPrice = foundItem.suggested_price * quantity;

      if (user.balance < totalPrice) {
        throw new BadRequestException(ERROR_MESSAGES.notEnoughBalance);
      }

      await client.query(
        `
        WITH updated_item AS (
          UPDATE items 
          SET quantity = quantity - $1 
          WHERE id = $2 
          RETURNING id, quantity
        ), updated_user AS (
          UPDATE users 
          SET balance = balance - $3 
          WHERE id = $4 
          RETURNING id, balance
        )
        INSERT INTO purchases (user_id, item_id, quantity) 
        VALUES ($4, $2, $1);
      `,
        [quantity, id, totalPrice, user_id],
      );

      await client.query('COMMIT');

      return { message: SUCCESS_MESSAGES.itemPurchased };
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(ERROR_MESSAGES.badRequest);
    } finally {
      if (client) client.release();
    }
  }
}
