import type { StockStatus } from "../features/inventory/types/product.types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

/** Stock is "low" once it has dropped to (or below) the minimum threshold. */
export function isLowStock(
  currentStock: number,
  minimumStock: number,
): boolean {
  return currentStock <= minimumStock;
}

/**
 * Three-way stock status used by status badges and filters:
 * - "out-of-stock": nothing left
 * - "low-stock": at or below the minimum threshold, but not zero
 * - "in-stock": above the minimum threshold
 */
export function getStockStatus(
  currentStock: number,
  minimumStock: number,
): StockStatus {
  if (currentStock <= 0) return "out-of-stock";
  if (isLowStock(currentStock, minimumStock)) return "low-stock";
  return "in-stock";
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Signed quantity display, e.g. "+50" or "-5". */
export function formatSignedQuantity(quantity: number): string {
  return quantity > 0 ? `+${quantity}` : `${quantity}`;
}

export function expiryDate(date: string) {
  const [month, year] = date.includes("/") ? date.split("/") : date.split('-');

  const fullDate = new Date(2000 + Number(year), Number(month) - 1, 1).toISOString();

  return formatDate(fullDate)
}
