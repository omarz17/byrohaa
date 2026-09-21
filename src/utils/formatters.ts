import { Currency, ImageFilterSettings } from '../types';
import { CURRENCY_CONFIGS } from '../data/initialData';

export function formatPrice(amountInUSD: number, currency: Currency = 'USD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const converted = amountInUSD * config.rate;

  if (currency === 'AED' || currency === 'SAR') {
    return `${config.symbol}${converted.toFixed(0)}`;
  }
  return `${config.symbol}${converted.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  const prefix = 'BYR';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}

export function getFilterStyle(filters?: ImageFilterSettings): string {
  if (!filters) return 'none';

  let filterStr = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;

  if (filters.warmth > 0) {
    // Warmth simulation via sepia + hue-rotate
    filterStr += ` sepia(${filters.warmth * 0.4}%)`;
  }

  if (filters.preset === 'warm_editorial') {
    filterStr += ' contrast(106%) brightness(102%) sepia(18%)';
  } else if (filters.preset === 'desert_sand') {
    filterStr += ' contrast(110%) brightness(98%) sepia(30%) saturate(85%)';
  } else if (filters.preset === 'golden_hour') {
    filterStr += ' contrast(105%) brightness(105%) sepia(35%) saturate(115%)';
  } else if (filters.preset === 'crisp_linen') {
    filterStr += ' contrast(112%) brightness(104%) saturate(92%)';
  } else if (filters.preset === 'noir') {
    filterStr += ' grayscale(100%) contrast(120%) brightness(96%)';
  }

  return filterStr;
}

export const STORAGE_KEYS = {
  PRODUCTS: 'byrohaa_products_v1',
  COLLECTIONS: 'byrohaa_collections_v1',
  ORDERS: 'byrohaa_orders_v1',
  CART: 'byrohaa_cart_v1',
  CURRENCY: 'byrohaa_currency_v1',
};
