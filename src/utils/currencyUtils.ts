/**
 * Currency utility for Indian Rupee (INR) formatting.
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

export function parseINR(value: string): number {
  const clean = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
