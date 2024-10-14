import { IModifiedItem } from '../interfaces';

export type TOriginalItem = Omit<
  IModifiedItem,
  'min_tradable_price' | 'min_non_tradable_price'
> & { id: number; min_price: number };
