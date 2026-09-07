import { apiRequest } from '../../../services/api/apiClient';
import type { CreateSaleRequest, Sale } from '../types/sale.types';

export function getSales(): Promise<{items: Sale[], nextToken: string | null | undefined}> {
  return apiRequest<{items: Sale[], nextToken: string | null | undefined}>('/sales');
}

export function getSaleById(saleId: string): Promise<Sale> {
  return apiRequest<Sale>(`/sales/${saleId}`);
}

// The backend owns the entire atomic operation: creating the sale record,
// its line items, decrementing product stock, and writing the matching
// SALE / STOCK_OUT inventory transaction. The UI only ever sends the cart
// and payment choice, and only ever reflects what the API confirms back -
// it never adjusts stock locally itself.
export function createSale(payload: CreateSaleRequest): Promise<Sale> {
  return apiRequest<Sale>('/sales', { method: 'POST', body: payload });
}

export function voidSale(saleId: string): Promise<Sale> {
  return apiRequest<Sale>(`/sales/${saleId}/void`, { method: 'POST' });
}
