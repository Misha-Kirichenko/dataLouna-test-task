export interface IModifiedItem {
  readonly market_hash_name: string;
  readonly currency: string;
  readonly suggested_price: number;
  readonly item_page: string;
  readonly market_page: string;
  readonly min_tradable_price: number;
  readonly min_non_tradable_price: number;
  readonly max_price: number;
  readonly mean_price: number;
  readonly quantity: number;
  readonly created_at: number;
  readonly updated_at: number;
}
