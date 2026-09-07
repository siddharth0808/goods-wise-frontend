export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHOD_OPTIONS)[number]['value'];

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_OPTIONS.find((option) => option.value === method)?.label ?? method;
}

export type SaleStatus = 'COMPLETED' | 'VOIDED';

export type DiscountType = 'fixed' | 'percentage';

export interface Discount {
  type: DiscountType;
  /** Rupees for "fixed", 0-100 for "percentage". */
  value: number;
}

/** A line in a completed sale (read-only, returned by the API). */
export interface SaleLineItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

/** Lightweight row shape for the Sales List table/cards. */
export interface SaleSummary {
  id: string;
  saleNumber: string;
  createdAt: string;
  itemCount: number;
  totalUnits: number;
  totalAmt: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
}

/** Full sale record, returned after creation or when viewing Sale Details. */
export interface Sale extends SaleSummary {
  items: SaleLineItem[];
  subTotalAmt: number;
  discount: Discount | null;
  discountAmount: number;
  paymentLabel?: string;
  cashierMode?: string;
}

export interface CreateSaleLineItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  rate:number;
  currentStock: number;
  total: number;
}

export interface CreateSaleRequest {
  items: CreateSaleLineItem[];
  discount: Discount | null;
  discountAmount: number;
  subTotalAmt:number;
  totalAmt:number;
  paymentMethod: PaymentMethod;
}

export interface SalesState {
  sales: Sale[];
  nextToken: string | null | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

  activeSale: Sale | null;
  activeSaleStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  activeSaleError: string | null;

  isVoiding: boolean;
  voidError: string | null;
}

/** A product staged in the current, in-progress sale (before checkout). */
export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  rate:number
  total: number;
  /** Snapshot of stock at the moment it was added/updated - re-validated by the backend at confirm time. */
  availableStock: number;
}

export type PosStep = 'building' | 'checkout' | 'processing' | 'success' | 'failed';

export interface PosState {
  cart: CartItem[];
  discount: Discount | null;
  discountAmount: number| null;
  subTotalAmt:number| null;
  totalAmt:number| null;
  paymentMethod: PaymentMethod | null;

  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createError: string | null;
  errorCode?: string;
  completedSale: Sale | null;
}
