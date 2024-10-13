import { AbstractCacheService } from 'src/common/services/abstractCache.service';
import { IModifiedItem } from './interfaces';

export class ItemsCacheService extends AbstractCacheService {
  private ttl = 300; //expire time in seconds
  private keyName = 'skinport-items';

  public async cacheItems(items: IModifiedItem[]): Promise<void> {
    await this.set<IModifiedItem[]>(this.keyName, items, this.ttl);
  }

  public async getCachedItems(): Promise<IModifiedItem[]> {
    const items = await this.get<IModifiedItem[]>(this.keyName);
    return items;
  }
}
