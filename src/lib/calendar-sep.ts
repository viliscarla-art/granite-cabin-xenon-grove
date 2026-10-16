import { addDays, eachDate, easterSunday, formatISO, isWeekend, lastFridayOfMonth, parseISO } from "./dates";
import type { CalendarMap, DayEntry, DayType } from "./types";

type Overlay = {
  type: DayType;
  label?: string;
  start: string;
  end?: string;
};

export type CycleTemplate = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  calendarStart: string;
  officialDays: number;
  overlays: Overlay[];
};

/** Acuerdo 18/06/25 — ciclo 2025-2026, 185 días. */
const TEMPLATE_2025_2026: CycleTemplate = {
  id: "2025-2026",
  name: "2025-2026",
  startDate: "2025-09-01",
  endDate: "2026-07-15",
  calendarStart: "2025-08-25",
  officialDays: 185,
  overlays: [
    { type: "cte_intensivo", start: "2025-08-25", end: "2025-08-29", label: "CTE fase intensiva" },
    { type: "lectivo", start: "2025-09-01", label: "Inicio de clases" },
    { type: "lectivo", start: "2025-09-08", label: "Jornada de concientización" },
    { type: "cte", start: "2025-09-26", label: "Consejo Técnico Escolar" },
    { type: "suspension", start: "2025-09-16", label: "Independencia de México" },
    { type: "cte", start: "2025-10-31", label: "Consejo Técnico Escolar" },
    { type: "evaluacion", start: "2025-11-14", label: "Registro de calificaciones" },
    { type: "suspension", start: "2025-11-17", label: "Revolución Mexicana" },
    { type: "cte", start: "2025-11-28", label: "Consejo Técnico Escolar" },
    { type: "receso", start: "2025-12-22", end: "2026-01-06", label: "Vacaciones de invierno" },
    { type: "suspension", start: "2025-12-25", label: "Navidad" },
    { type: "suspension", start: "2026-01-01", label: "Año Nuevo" },
    { type: "taller", start: "2026-01-07", label: "Taller intensivo (dirección)" },
    { type: "taller", start: "2026-01-08", end: "2026-01-09", label: "Taller intensivo (docente)" },
    { type: "cte", start: "2026-01-30", label: "Consejo Técnico Escolar" },
    { type: "suspension", start: "2026-02-02", label: "Día de la Constitución" },
    { type: "lectivo", start: "2026-02-03", end: "2026-02-13", label: "Preinscripciones 2026-2027" },
    { type: "cte", start: "2026-02-27", label: "Consejo Técnico Escolar" },
    { type: "evaluacion", start: "2026-03-13", label: "Registro de calificaciones" },
    { type: "suspension", start: "2026-03-16", label: "Natalicio de Benito Juárez" },
    { type: "cte", start: "2026-03-27", label: "Consejo Técnico Escolar" },
    { type: "receso", start: "2026-03-30", end: "2026-04-10", label: "Vacaciones de Semana Santa" },
    { type: "suspension", start: "2026-05-01", label: "Día del Trabajo" },
    { type: "suspension", start: "2026-05-05", label: "Batalla de Puebla" },
    { type: "suspension", start: "2026-05-15", label: "Día del Maestro" },
    { type: "cte", start: "2026-05-29", label: "Consejo Técnico Escolar" },
    { type: "cte", start: "2026-06-26", label: "Consejo Técnico Escolar" },
    { type: "evaluacion", start: "2026-07-03", label: "Registro de calificaciones" },
    { type: "lectivo", start: "2026-07-15", label: "Fin de clases" },
  ],
};

/** Acuerdo 07/07/26 — ciclo 2026-2027, 185 días. */
const TEMPLATE_2026_2027: CycleTemplate = {
  id: "2026-2027",
  name: "2026-2027",
  startDate: "2026-08-31",
  endDate: "2027-07-09",
  calendarStart: "2026-08-24",
  officialDays: 185,
  overlays: [
    { type: "cte_intensivo", start: "2026-08-24", end: "2026-08-28", label: "CTE fase intensiva" },
    { type: "lectivo", start: "2026-08-31", label: "Inicio de clases" },
    { type: "suspension", start: "2026-09-16", label: "Independencia de México" },
    { type: "cte", start: "2026-09-25", label: "Consejo Técnico Escolar" },
    { type: "cte", start: "2026-10-30", label: "Consejo Técnico Escolar" },
    { type: "suspension", start: "2026-11-02", label: "Día de Muertos" },
    { type: "evaluacion", start: "2026-11-13", label: "Registro de calificaciones" },
    { type: "suspension", start: "2026-11-16", label: "Revolución Mexicana" },
    { type: "cte", start: "2026-11-27", label: "Consejo Técnico Escolar" },
    { type: "receso", start: "2026-12-21", end: "2027-01-05", label: "Vacaciones de invierno" },
    { type: "suspension", start: "2026-12-25", label: "Navidad" },
    { type: "suspension", start: "2027-01-01", label: "Año Nuevo" },
    { type: "suspension", start: "2027-01-06", label: "Día de Reyes" },
    { type: "cte", start: "2027-01-29", label: "Consejo Técnico Escolar" },
    { type: "suspension", start: "2027-02-01", label: "Día de la Constitución" },
    { type: "lectivo", start: "2027-02-02", end: "2027-02-12", label: "Preinscripciones 2027-2028" },
    { type: "cte", start: "2027-02-26", label: "Consejo Técnico Escolar" },
    { type: "evaluacion", start: "2027-03-05", label: "Registro de calificaciones" },
    { type: "suspension", start: "2027-03-15", label: "Natalicio de Benito Juárez" },
    { type: "receso", start: "2027-03-22", end: "2027-04-03", label: "Vacaciones de Semana Santa" },
    { type: "cte", start: "2027-04-30", label: "Consejo Técnico Escolar" },
    { type: "suspension", start: "2027-05-05", label: "Batalla de Puebla" },
    { type: "cte", start: "2027-05-28", label: "Consejo Técnico Escolar" },
    { type: "cte", start: "2027-06-25", label: "Consejo Técnico Escolar" },
    { type: "evaluacion", start: "2027-07-02", label: "Registro de calificaciones" },
    { type: "lectivo", start: "2027-07-09", label: "Fin de clases" },
  ],
};

export const OFFICIAL_TEMPLATES: CycleTemplate[] = [TEMPLATE_2026_2027, TEMPLATE_2025_2026];

export function templateByName(name: string): CycleTemplate | undefined {
  return OFFICIAL_TEMPLATES.find((t) => t.name === name || t.id === name);
}

const PRIORITY: Record<DayType, number> = {
  receso: 80,
  cte_intensivo: 70,
  taller: 65,
  cte: 60,
  evaluacion: 55,
  suspension: 50,
  incapacidad: 45,
  permiso_economico: 45,
  supervision: 45,
  sindical: 45,
  lectivo: 10,
  fin_de_semana: 5,
};

function applyOverlay(map: CalendarMap, overlay: Overlay, source: DayEntry["source"]) {
  const dates = eachDate(overlay.start, overlay.end ?? overlay.start);
  for (const iso of dates) {
    const current = map[iso];
    if (!current) continue;
    if (current.type === "fin_de_semana" && overlay.type === "lectivo") {
      if (overlay.label) {
        map[iso] = { ...current, label: overlay.label, officialLabel: overlay.label };
      }
      continue;
    }
    if (PRIORITY[overlay.type] < PRIORITY[current.type] && overlay.type === "lectivo") {
      if (overlay.label && !current.label) {
        map[iso] = { ...current, label: overlay.label, officialLabel: overlay.label };
      }
      continue;
    }
    if (overlay.type === "suspension" && (current.type === "receso" || current.type === "cte")) {
      map[iso] = {
        ...current,
        label: overlay.label ?? current.label,
        officialLabel: overlay.label ?? current.officialLabel,
      };
      continue;
    }
    map[iso] = {
      type: overlay.type,
      label: overlay.label ?? current.label,
      source,
      officialType: overlay.type,
      officialLabel: overlay.label ?? current.officialLabel,
    };
  }
}

export function buildCalendar(start: string, end: string, overlays: Overlay[], source: DayEntry["source"] = "sep"): CalendarMap {
  const map: CalendarMap = {};
  for (const iso of eachDate(start, end)) {
    if (isWeekend(iso)) {
      map[iso] = { type: "fin_de_semana", source, officialType: "fin_de_semana" };
    } else {
      map[iso] = { type: "lectivo", source, officialType: "lectivo" };
    }
  }
  const sorted = [...overlays].sort((a, b) => PRIORITY[a.type] - PRIORITY[b.type]);
  for (const overlay of sorted) applyOverlay(map, overlay, source);
  return map;
}

export function calendarFromTemplate(template: CycleTemplate): CalendarMap {
  return buildCalendar(template.calendarStart, template.endDate, template.overlays, "sep");
}

function mondayHoliday(year: number, monthIndex: number, nthMonday: number): string {
  const first = new Date(year, monthIndex, 1);
  const firstMonday = 1 + ((8 - first.getDay()) % 7);
  return formatISO(new Date(year, monthIndex, firstMonday + (nthMonday - 1) * 7));
}

export function generateSepStyleCalendar(startDate: string, endDate: string): CalendarMap {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const calendarStart = addDays(startDate, -7);
  const overlays: Overlay[] = [
    { type: "lectivo", start: startDate, label: "Inicio de clases" },
    { type: "lectivo", start: endDate, label: "Fin de clases" },
  ];

  const intensivoEnd = addDays(startDate, -3);
  const intensivoStart = addDays(intensivoEnd, -4);
  overlays.push({
    type: "cte_intensivo",
    start: intensivoStart,
    end: intensivoEnd,
    label: "CTE fase intensiva",
  });

  const cteMonths = [8, 9, 10, 0, 1, 3, 4, 5];
  const years = new Set([start.getFullYear(), end.getFullYear()]);
  for (const year of years) {
    for (const month of cteMonths) {
      const iso = lastFridayOfMonth(year, month);
      if (iso >= startDate && iso <= endDate) {
        overlays.push({ type: "cte", start: iso, label: "Consejo Técnico Escolar" });
      }
    }
    overlays.push({ type: "suspension", start: `${year}-09-16`, label: "Independencia de México" });
    overlays.push({ type: "suspension", start: `${year}-11-02`, label: "Día de Muertos" });
    overlays.push({
      type: "suspension",
      start: mondayHoliday(year, 10, 3),
      label: "Revolución Mexicana",
    });
    overlays.push({ type: "suspension", start: `${year}-12-25`, label: "Navidad" });
    overlays.push({ type: "suspension", start: `${year}-01-01`, label: "Año Nuevo" });
    overlays.push({ type: "suspension", start: `${year}-01-06`, label: "Día de Reyes" });
    overlays.push({
      type: "suspension",
      start: mondayHoliday(year, 1, 1),
      label: "Día de la Constitución",
    });
    overlays.push({
      type: "suspension",
      start: mondayHoliday(year, 2, 3),
      label: "Natalicio de Benito Juárez",
    });
    overlays.push({ type: "suspension", start: `${year}-05-01`, label: "Día del Trabajo" });
    overlays.push({ type: "suspension", start: `${year}-05-05`, label: "Batalla de Puebla" });
    overlays.push({ type: "suspension", start: `${year}-05-15`, label: "Día del Maestro" });

    overlays.push({
      type: "receso",
      start: `${year}-12-21`,
      end: `${year + 1}-01-05`,
      label: "Vacaciones de invierno",
    });

    const easter = easterSunday(year);
    const recesoStart = new Date(easter);
    recesoStart.setDate(easter.getDate() - 6);
    const recesoEnd = new Date(easter);
    recesoEnd.setDate(easter.getDate() + 6);
    overlays.push({
      type: "receso",
      start: formatISO(recesoStart),
      end: formatISO(recesoEnd),
      label: "Vacaciones de Semana Santa",
    });
  }

  const startYear = start.getFullYear();
  overlays.push({
    type: "evaluacion",
    start:
      lastFridayOfMonth(startYear, 10) < `${startYear}-11-20`
        ? lastFridayOfMonth(startYear, 10)
        : `${startYear}-11-14`,
    label: "Registro de calificaciones",
  });
  overlays.push({
    type: "evaluacion",
    start: lastFridayOfMonth(end.getFullYear(), 2),
    label: "Registro de calificaciones",
  });
  overlays.push({
    type: "evaluacion",
    start:
      lastFridayOfMonth(end.getFullYear(), end.getMonth()) > endDate
        ? addDays(endDate, -7)
        : lastFridayOfMonth(end.getFullYear(), end.getMonth()),
    label: "Registro de calificaciones",
  });

  return buildCalendar(calendarStart < intensivoStart ? calendarStart : intensivoStart, endDate, overlays, "generated");
}

export function isAttendanceDay(entry: DayEntry | undefined): boolean {
  return entry?.type === "lectivo";
}

export function lectivoDates(calendar: CalendarMap, start?: string, end?: string): string[] {
  return Object.keys(calendar)
    .filter((iso) => {
      if (start && iso < start) return false;
      if (end && iso > end) return false;
      return calendar[iso]?.type === "lectivo";
    })
    .sort();
}

export function countLectivos(calendar: CalendarMap, start?: string, end?: string): number {
  return lectivoDates(calendar, start, end).length;
}

export function markedDays(calendar: CalendarMap, start?: string, end?: string): { iso: string; entry: DayEntry }[] {
  return Object.keys(calendar)
    .filter((iso) => {
      if (start && iso < start) return false;
      if (end && iso > end) return false;
      const entry = calendar[iso];
      if (!entry) return false;
      if (entry.type === "fin_de_semana") return false;
      return entry.type !== "lectivo" || Boolean(entry.label);
    })
    .sort()
    .map((iso) => ({ iso, entry: calendar[iso] as DayEntry }));
}

export const MANUAL_DAY_TYPES: { type: DayType; label: string; hint: string }[] = [
  { type: "lectivo", label: "Día de clase", hint: "Se toma asistencia" },
  { type: "cte", label: "Consejo Técnico Escolar", hint: "Sin clases" },
  { type: "cte_intensivo", label: "CTE fase intensiva", hint: "Sin clases" },
  { type: "evaluacion", label: "Registro de evaluaciones", hint: "Descarga administrativa" },
  { type: "suspension", label: "Suspensión oficial", hint: "Día inhábil SEP" },
  { type: "receso", label: "Vacaciones / receso", hint: "Periodo vacacional" },
  { type: "taller", label: "Taller intensivo", hint: "Formación docente" },
  { type: "incapacidad", label: "Incapacidad", hint: "Ausencia médica de la docente" },
  { type: "permiso_economico", label: "Permiso económico", hint: "Permiso de la docente" },
  { type: "supervision", label: "Reunión en supervisión", hint: "Jornada en supervisión" },
  { type: "sindical", label: "Reunión sindical", hint: "Jornada sindical" },
];

export const DAY_META: Record<
  DayType,
  { label: string; short: string; tone: "class" | "sep" | "break" | "staff" | "weekend" }
> = {
  lectivo: { label: "Día de clase", short: "Clase", tone: "class" },
  cte: { label: "Consejo Técnico", short: "CTE", tone: "sep" },
  cte_intensivo: { label: "CTE intensivo", short: "CTE-I", tone: "sep" },
  evaluacion: { label: "Registro de evaluaciones", short: "Eval.", tone: "sep" },
  suspension: { label: "Suspensión oficial", short: "Susp.", tone: "break" },
  receso: { label: "Vacaciones", short: "Receso", tone: "break" },
  taller: { label: "Taller intensivo", short: "Taller", tone: "sep" },
  incapacidad: { label: "Incapacidad", short: "Incap.", tone: "staff" },
  permiso_economico: { label: "Permiso económico", short: "P. ec.", tone: "staff" },
  supervision: { label: "Reunión en supervisión", short: "Superv.", tone: "staff" },
  sindical: { label: "Reunión sindical", short: "Sindical", tone: "staff" },
  fin_de_semana: { label: "Fin de semana", short: "FDS", tone: "weekend" },
};
