
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, PackageColor, PackageSize } from '../types/sales';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  productId: z.string().min(1, 'Выберите товар'),
  packageColor: z.enum(['red', 'green', 'yellow'] as const),
  packageSize: z.enum(['large', 'small'] as const),
  quantity: z.number().min(1, 'Минимальное количество: 1'),
  unitPrice: z.number().min(1, 'Укажите цену'),
  date: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface SaleFormProps {
  products: Product[];
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

const SaleForm: React.FC<SaleFormProps> = ({
  products,
  onSubmit,
  initialData,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      ...initialData,
    },
  });

  const packageColors: { value: PackageColor; label: string }[] = [
    { value: 'red', label: 'Красный' },
    { value: 'green', label: 'Зеленый' },
    { value: 'yellow', label: 'Желтый' },
  ];

  const packageSizes: { value: PackageSize; label: string }[] = [
    { value: 'large', label: 'Большой' },
    { value: 'small', label: 'Маленький' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Товар</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите товар" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="packageColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цвет упаковки</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите цвет" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {packageColors.map((color) => (
                      <SelectItem
                        key={color.value}
                        value={color.value}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-3 h-3 rounded-full',
                              {
                                'bg-red-500': color.value === 'red',
                                'bg-green-500': color.value === 'green',
                                'bg-yellow-500': color.value === 'yellow',
                              }
                            )}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Размер упаковки</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите размер" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {packageSizes.map((size) => (
                      <SelectItem
                        key={size.value}
                        value={size.value}
                      >
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена за единицу</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Сохранить
        </Button>
      </form>
    </Form>
  );
};

export default SaleForm;
