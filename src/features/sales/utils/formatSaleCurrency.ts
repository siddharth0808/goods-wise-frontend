// The Sprint 4 (Sales/POS) designs consistently use ₹ (INR) throughout,
// while the rest of the app (Inventory, Products) was built against the
// shared `formatCurrency` in `utils/formatters.ts`, which is USD. Rather
// than changing that shared formatter - and silently altering currency
// display on existing, unrelated screens - the Sales feature gets its own
// scoped formatter that matches its designs exactly.
export function formatSaleCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
