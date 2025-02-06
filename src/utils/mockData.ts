
import { Product, Sale, PackageColor, PackageSize } from '../types/sales';

const herbNames = [
  'Purple Haze', 'Green Dream', 'Sunset Bliss', 'Ocean Breeze',
  'Mountain Mist', 'Forest Dew', 'Valley Calm', 'Desert Rose',
  'Spring Fresh', 'Summer Joy', 'Autumn Gold', 'Winter Frost',
  'Morning Glory', 'Evening Peace', 'Midnight Magic', 'Dawn Delight',
  'Twilight Serenity', 'Moonlight Dreams'
];

export const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  
  // Generate herb products
  herbNames.forEach((name, index) => {
    products.push({
      id: `herb-${index + 1}`,
      name,
      type: 'herb',
      price: Math.floor(Math.random() * (5000 - 1000) + 1000),
      stock: Math.floor(Math.random() * 100) + 50,
    });
  });

  // Generate other products to reach 105 total
  for (let i = herbNames.length; i < 105; i++) {
    products.push({
      id: `product-${i + 1}`,
      name: `Product ${i + 1}`,
      type: 'other',
      price: Math.floor(Math.random() * (3000 - 500) + 500),
      stock: Math.floor(Math.random() * 100) + 50,
    });
  }

  return products;
};

export const generateMockSales = (products: Product[]): Sale[] => {
  const sales: Sale[] = [];
  const packageColors: PackageColor[] = ['red', 'green', 'yellow'];
  const packageSizes: PackageSize[] = ['large', 'small'];

  // Generate random sales for the last 30 days
  for (let i = 0; i < 50; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    sales.push({
      id: `sale-${i + 1}`,
      date: date.toISOString().split('T')[0],
      productId: product.id,
      packageColor: packageColors[Math.floor(Math.random() * packageColors.length)],
      packageSize: packageSizes[Math.floor(Math.random() * packageSizes.length)],
      quantity,
      unitPrice: product.price,
      totalAmount: quantity * product.price,
    });
  }

  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
