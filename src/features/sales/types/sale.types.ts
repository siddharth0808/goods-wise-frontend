import type { Product } from '../../inventory/types/product.types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleRecord {
  id: string;
  date: string;
  items: number;
  total: number;
  payment: 'UPI' | 'Cash' | 'Card';
  status: 'Completed' | 'Pending';
}

export const sampleSales: SaleRecord[] = [
  { id: 'SALE-1001', date: '03 Sep 10:20 AM', items: 3, total: 520, payment: 'UPI', status: 'Completed' },
  { id: 'SALE-1002', date: '03 Sep 11:10 AM', items: 1, total: 120, payment: 'Cash', status: 'Completed' },
  { id: 'SALE-1003', date: '03 Sep 12:25 PM', items: 5, total: 850, payment: 'Card', status: 'Completed' },
  { id: 'SALE-1004', date: '03 Sep 03:05 PM', items: 3, total: 500, payment: 'UPI', status: 'Completed' },
];
