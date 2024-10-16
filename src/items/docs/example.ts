import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';

export const ITEMS_EXAMPLE = [
  {
    market_hash_name: 'AK-47 | Aquamarine Revenge (Battle-Scarred)',
    currency: 'EUR',
    suggested_price: 13.18,
    item_page:
      'https://skinport.com/item/csgo/ak-47-aquamarine-revenge-battle-scarred',
    market_page:
      'https://skinport.com/market/730?cat=Rifle&item=Aquamarine+Revenge',
    min_non_tradable_price: 11.33,
    min_tradable_price: 11.0,
    max_price: 18.22,
    mean_price: 12.58,
    quantity: 25,
    created_at: 1535988253,
    updated_at: 1568073728,
  },
  {
    market_hash_name: '★ M9 Bayonet | Fade (Factory New)',
    currency: 'EUR',
    suggested_price: 319.11,
    item_page: 'https://skinport.com/item/csgo/m9-bayonet-fade-factory-new',
    market_page: 'https://skinport.com/market/730?cat=Knife&item=Fade',
    min_non_tradable_price: 318.95,
    min_tradable_price: 317.95,
    max_price: null,
    mean_price: null,
    quantity: 15,
    created_at: 1535988302,
    updated_at: 1568073725,
  },
];

export const ITEM_PURCHASED_EXAMPLE = {
  message: SUCCESS_MESSAGES.itemPurchased,
};

export const ITEM_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  message: ERROR_MESSAGES.itemNotFound,
  error: 'Not Found',
};
