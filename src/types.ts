export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export type GarmentCategory =
  | 'All'
  | 'Abayas'
  | 'Hijabs & Scarves'
  | 'Modest Sets'
  | 'Kimonos & Kaftans'
  | 'Prayer Sets'
  | 'Occasion Wear';

export interface ImageFilterSettings {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  warmth: number; // 0 to 100 (default 0)
  aspectRatio: '3:4' | '1:1' | '4:5' | '16:9';
  preset: 'original' | 'warm_editorial' | 'desert_sand' | 'golden_hour' | 'crisp_linen' | 'noir';
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  filters?: ImageFilterSettings;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  collectionId: string;
  category: GarmentCategory;
  description: string;
  fabrics: string[];
  colors: ProductColor[];
  sizes: string[]; // e.g. ['XS', 'S', 'M', 'L', 'XL']
  lengths: string[]; // e.g. ['52"', '54"', '56"', '58"', '60"']
  images: ProductImage[];
  isNew?: boolean;
  isBestseller?: boolean;
  inStock: number;
  careInstructions: string;
  fitNotes: string;
  badge?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  isActive: boolean;
  season: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  productId: string;
  title: string;
  price: number;
  image: string;
  selectedColor: ProductColor;
  selectedSize: string;
  selectedLength: string;
  quantity: number;
  category: GarmentCategory;
}

export type Currency = 'USD' | 'AED' | 'SAR' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // rate against USD base (1.0)
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  currency: Currency;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'apple_pay' | 'cod';
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
}
