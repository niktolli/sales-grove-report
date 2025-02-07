import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileDown, Scale } from 'lucide-react';
import { generateMockProducts, generateMockSales, calculateTotalRevenue } from '@/utils/mockData';
import { Product, Sale, SaleWithProduct } from '@/types/sales';
import SalesTable from '../components/SalesTable';
import SaleForm from '../components/SaleForm';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saleToEdit, setSaleToEdit] = useState<SaleWithProduct | null>(null);
  const { toast } = useToast();
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const mockProducts = generateMockProducts();
      const mockSales = generateMockSales(mockProducts);
      
      // Convert sales to SaleWithProduct by linking each sale to its product details
      const salesWithProducts = mockSales.map(sale => ({
        ...sale,
        product: mockProducts.find(p => p.id === sale.productId)!
      }));

      setProducts(mockProducts);
      setSales(salesWithProducts);
      setTotalRevenue(calculateTotalRevenue(salesWithProducts));
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSaleSubmit = (formData: Omit<Sale, 'id' | 'totalAmount' | 'saleType'> & { saleType: 'package' | 'grams' }) => {
    const product = products.find(p => p.id === formData.productId)!;
    const newSale: SaleWithProduct = {
      ...formData,
      id: `sale-${Date.now()}`,
      totalAmount: formData.quantity * formData.unitPrice,
      product
    };

    setSales(prev => {
      const newSales = [newSale, ...prev];
      setTotalRevenue(calculateTotalRevenue(newSales));
      return newSales;
    });

    toast({
      title: "Продажа добавлена",
      description: "Новая запись успешно добавлена в отчет",
    });
  };

  const handleSaleEdit = (sale: SaleWithProduct) => {
    setSaleToEdit(sale);
  };

  const handleSaleDelete = (saleId: string) => {
    const saleToDelete = sales.find(s => s.id === saleId)!;
    
    setSales(prev => {
      const newSales = prev.filter(s => s.id !== saleId);
      setTotalRevenue(calculateTotalRevenue(newSales));
      return newSales;
    });

    toast({
      title: "Продажа удалена",
      description: "Запись успешно удалена из отчета",
    });
  };

  const handleExport = () => {
    const headers = [
      'Дата',
      'Товар',
      'Тип продажи',
      'Цвет упаковки',
      'Размер упаковки',
      'Граммы',
      'Количество',
      'Цена за единицу',
      'Общая сумма'
    ].join(',');

    const rows = sales.map(sale => [
      sale.date,
      sale.product.name,
      sale.saleType === 'grams' ? 'Граммовка' : 'Упаковка',
      sale.packageColor === 'red' ? 'Красный' : sale.packageColor === 'green' ? 'Зеленый' : sale.packageColor === 'yellow' ? 'Желтый' : '',
      sale.packageSize === 'large' ? 'Большой' : sale.packageSize === 'small' ? 'Маленький' : '',
      sale.grams || '',
      sale.quantity,
      sale.unitPrice,
      sale.totalAmount,
    ].join(','));

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Total Revenue Card */}
      <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">Общая выручка</h2>
          <p className="text-4xl font-semibold text-green-600 mt-2">฿{totalRevenue.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Отчет по продажам</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Добавить продажу
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить продажу</DialogTitle>
              </DialogHeader>
              <SaleForm
                products={products}
                onSubmit={handleSaleSubmit}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Scale className="w-4 h-4 mr-2" />
                Добавить позицию по граммовкам
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить позицию по граммовкам</DialogTitle>
              </DialogHeader>
              <SaleForm
                products={products.filter(p => p.type === 'herb')}
                onSubmit={handleSaleSubmit}
                saleType="grams"
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExport}>
            <FileDown className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      <Dialog open={!!saleToEdit} onOpenChange={(open) => !open && setSaleToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать продажу</DialogTitle>
          </DialogHeader>
          {saleToEdit && (
            <SaleForm
              products={products}
              onSubmit={(formData) => {
                const updatedSale: SaleWithProduct = {
                  ...saleToEdit,
                  ...formData,
                  totalAmount: formData.quantity * formData.unitPrice,
                };

                setSales(prev => {
                  const newSales = prev.map(s =>
                    s.id === saleToEdit.id ? updatedSale : s
                  );
                  setTotalRevenue(calculateTotalRevenue(newSales));
                  return newSales;
                });

                setSaleToEdit(null);
                toast({
                  title: "Продажа обновлена",
                  description: "Изменения успешно сохранены",
                });
              }}
              initialData={{
                productId: saleToEdit.productId,
                packageColor: saleToEdit.packageColor,
                packageSize: saleToEdit.packageSize,
                grams: saleToEdit.grams,
                quantity: saleToEdit.quantity,
                unitPrice: saleToEdit.unitPrice,
                date: saleToEdit.date,
                saleType: saleToEdit.saleType,
              }}
              saleType={saleToEdit.saleType}
            />
          )}
        </DialogContent>
      </Dialog>

      <SalesTable
        sales={sales}
        onEdit={handleSaleEdit}
        onDelete={handleSaleDelete}
      />
    </div>
  );
};

export default Index; 