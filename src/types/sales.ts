export type PackageColor = 'red' | 'green' | 'yellow';
export type PackageSize = 'large' | 'small';
export type SaleType = 'package' | 'grams';

export interface Product {
  id: string;
  name: string;
  type: 'herb' | 'other';
  price: number;
  pricePerGram?: number;
}

export interface Sale {
  id: string;
  date: string;
  productId: string;
  saleType: SaleType;
  packageColor?: PackageColor;
  packageSize?: PackageSize;
  grams?: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  comment?: string;
}

export interface SaleWithProduct extends Sale {
  product: Product;
} 