/**
 * Date utility functions for flight and hotel booking.
 */

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFutureDateString(daysAhead: number, fromDateStr?: string): string {
  const base = fromDateStr ? new Date(fromDateStr) : new Date();
  base.setDate(base.getDate() + daysAhead);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const diffTime = outD.getTime() - inD.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function isDateInPast(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = getTodayString();
  return dateStr < today;
}

export function isReturnBeforeDeparture(dep: string, ret?: string): boolean {
  if (!ret || !dep) return false;
  return ret < dep;
}
