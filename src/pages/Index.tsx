
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileDown } from 'lucide-react';
import { generateMockProducts, generateMockSales } from '../utils/mockData';
import { Product, Sale, SaleWithProduct } from '../types/sales';
import SalesTable from '../components/SalesTable';
import SaleForm from '../components/SaleForm';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saleToEdit, setSaleToEdit] = useState<SaleWithProduct | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = () => {
      const mockProducts = generateMockProducts();
      const mockSales = generateMockSales(mockProducts);
      
      // Convert sales to SaleWithProduct
      const salesWithProducts = mockSales.map(sale => ({
        ...sale,
        product: mockProducts.find(p => p.id === sale.productId)!
      }));

      setProducts(mockProducts);
      setSales(salesWithProducts);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSaleSubmit = (formData: Omit<Sale, 'id' | 'totalAmount'>) => {
    const product = products.find(p => p.id === formData.productId)!;
    const newSale: SaleWithProduct = {
      ...formData,
      id: `sale-${Date.now()}`,
      totalAmount: formData.quantity * formData.unitPrice,
      product
    };

    setSales(prev => [newSale, ...prev]);
    setProducts(prev =>
      prev.map(p =>
        p.id === product.id
          ? { ...p, stock: p.stock - formData.quantity }
          : p
      )
    );

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
    
    setSales(prev => prev.filter(s => s.id !== saleId));
    setProducts(prev =>
      prev.map(p =>
        p.id === saleToDelete.productId
          ? { ...p, stock: p.stock + saleToDelete.quantity }
          : p
      )
    );

    toast({
      title: "Продажа удалена",
      description: "Запись успешно удалена из отчета",
    });
  };

  const handleExport = () => {
    const headers = [
      'Дата',
      'Товар',
      'Цвет упаковки',
      'Размер упаковки',
      'Количество',
      'Цена за единицу',
      'Общая сумма',
      'Остаток'
    ].join(',');

    const rows = sales.map(sale => [
      sale.date,
      sale.product.name,
      sale.packageColor === 'red' ? 'Красный' : sale.packageColor === 'green' ? 'Зеленый' : 'Желтый',
      sale.packageSize === 'large' ? 'Большой' : 'Маленький',
      sale.quantity,
      sale.unitPrice,
      sale.totalAmount,
      sale.product.stock
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

                setSales(prev =>
                  prev.map(s =>
                    s.id === saleToEdit.id ? updatedSale : s
                  )
                );

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
                quantity: saleToEdit.quantity,
                unitPrice: saleToEdit.unitPrice,
                date: saleToEdit.date,
              }}
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
