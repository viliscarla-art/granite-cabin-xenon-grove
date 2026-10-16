const WEEKDAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function formatISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return formatISO(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return formatISO(d);
}

export function weekday(iso: string): number {
  return parseISO(iso).getDay();
}

export function isWeekend(iso: string): boolean {
  const w = weekday(iso);
  return w === 0 || w === 6;
}

export function eachDate(start: string, end: string): string[] {
  const out: string[] = [];
  const last = parseISO(end);
  const d = parseISO(start);
  while (d <= last) {
    out.push(formatISO(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function monthBounds(year: number, monthIndex: number): { start: string; end: string } {
  const start = formatISO(new Date(year, monthIndex, 1));
  const end = formatISO(new Date(year, monthIndex + 1, 0));
  return { start, end };
}

export function monthsInRange(start: string, end: string): { year: number; month: number; key: string; label: string }[] {
  const out: { year: number; month: number; key: string; label: string }[] = [];
  const s = parseISO(start);
  const e = parseISO(end);
  const cursor = new Date(s.getFullYear(), s.getMonth(), 1);
  while (cursor <= e) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    out.push({
      year,
      month,
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: `${MONTHS_ES[month]} ${year}`,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return out;
}

export function weekdayLabel(iso: string): string {
  return WEEKDAYS_ES[weekday(iso)] ?? "";
}

export function weekdayShort(iso: string): string {
  return (WEEKDAYS_ES[weekday(iso)] ?? "").slice(0, 3);
}

export function formatLong(iso: string): string {
  const d = parseISO(iso);
  return `${WEEKDAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatShort(iso: string): string {
  const d = parseISO(iso);
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)}`;
}

export function formatDayNum(iso: string): string {
  return String(parseISO(iso).getDate());
}

export function compareISO(a: string, b: string): number {
  return a.localeCompare(b);
}

export function clampDate(iso: string, start: string, end: string): string {
  if (iso < start) return start;
  if (iso > end) return end;
  return iso;
}

export function lastFridayOfMonth(year: number, monthIndex: number): string {
  const last = new Date(year, monthIndex + 1, 0);
  const offset = (last.getDay() + 2) % 7;
  last.setDate(last.getDate() - offset);
  return formatISO(last);
}

/** Anonymous Gregorian algorithm — returns month 3 or 4. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export const MONTHS_ES_LIST = MONTHS_ES;
export const WEEKDAYS_ES_LIST = WEEKDAYS_ES;
