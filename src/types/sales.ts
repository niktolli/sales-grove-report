
export type PackageColor = 'red' | 'green' | 'yellow';
export type PackageSize = 'large' | 'small';

export interface Product {
  id: string;
  name: string;
  type: 'herb' | 'other';
  price: number;
  stock: number;
}

export interface Sale {
  id: string;
  date: string;
  productId: string;
  packageColor: PackageColor;
  packageSize: PackageSize;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  comment?: string;
}

export interface SaleWithProduct extends Sale {
  product: Product;
}
