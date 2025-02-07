import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { SaleWithProduct } from '../types/sales';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SalesTableProps {
  sales: SaleWithProduct[];
  onEdit: (sale: SaleWithProduct) => void;
  onDelete: (saleId: string) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, onEdit, onDelete }) => {
  const groupedSales = sales.reduce((acc, sale) => {
    const date = sale.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(sale);
    return acc;
  }, {} as Record<string, SaleWithProduct[]>);

  return (
    <div className="rounded-lg border bg-card">
      {Object.entries(groupedSales).map(([date, dateSales]) => {
        const dailyTotal = dateSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        return (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-muted/50 p-4 sticky top-0 z-10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">
                {format(new Date(date), 'd MMMM yyyy', { locale: ru })}
              </h3>
              <p className="text-muted-foreground">
                Итого за день: {dailyTotal.toLocaleString('ru-RU')} ฿
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип продажи</TableHead>
                  <TableHead>Упаковка / Граммы</TableHead>
                  <TableHead className="text-right">Количество</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead className="text-center">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dateSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.product.name}</TableCell>
                    <TableCell>
                      {sale.saleType === 'grams' ? 'Граммовка' : 'Упаковка'}
                    </TableCell>
                    <TableCell>
                      {sale.saleType === 'grams' ? (
                        <span>{sale.grams} г</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              sale.packageColor === 'red'
                                ? 'bg-red-500'
                                : sale.packageColor === 'green'
                                ? 'bg-green-500'
                                : 'bg-yellow-500'
                            }`}
                          />
                          <span className="capitalize">
                            {sale.packageSize === 'large' ? 'Большой' : 'Маленький'}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell className="text-right">
                      {sale.unitPrice.toLocaleString('ru-RU')} ฿
                      {sale.saleType === 'grams' && ' /г'}
                    </TableCell>
                    <TableCell className="text-right">
                      {sale.totalAmount.toLocaleString('ru-RU')} ฿
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(sale)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(sale.id)}
                          className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SalesTable; 