const DAY_MS = 24 * 60 * 60 * 1000;

/** Lokales Datum als YYYY-MM-DD. */
export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

/** Ganze Kalendertage von `from` bis `to` (negativ, wenn `to` vor `from` liegt). */
export function daysBetween(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / DAY_MS);
}

/**
 * Lernserie: Anzahl aufeinanderfolgender Tage mit Aktivität bis heute.
 * Ist heute noch nichts passiert, zählt die Serie bis gestern weiter.
 */
export function streak(activity: Record<string, number>, today: Date = new Date()): number {
  let cursor = today;
  if (!activity[dayKey(cursor)]) cursor = addDays(cursor, -1);
  let count = 0;
  while (activity[dayKey(cursor)]) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function formatDate(key: string): string {
  const [y, m, d] = key.split('-');
  return `${d}.${m}.${y}`;
}

export const DAY = DAY_MS;

/** „24.12.2026“ → „2026-12-24“ (oder null bei ungültiger Eingabe). */
export function parseGermanDate(input: string): string | null {
  const m = input.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return dayKey(date);
}
