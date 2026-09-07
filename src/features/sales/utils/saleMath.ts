import type { CartItem, Discount } from '../types/sale.types';

export function calculateSubtotal(items: Array<{ unitPrice: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function calculateDiscountAmount(subtotal: number, discount: Discount | null): number {
  if (!discount || discount.value <= 0) return 0;
  const amount = discount.type === 'percentage' ? (subtotal * discount.value) / 100 : discount.value;
  // Never let a discount exceed the subtotal (would produce a negative total).
  return Math.min(amount, subtotal);
}

export function calculateTotal(subtotal: number, discountAmount: number): number {
  return Math.max(0, subtotal - discountAmount);
}

export function calculateTotalUnits(items: Array<{ quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** True once every cart line is within its snapshot of available stock. */
export function isCartValid(cart: CartItem[]): boolean {
  return cart.length > 0 && cart.every((item) => item.quantity > 0 && item.quantity <= item.availableStock);
}
