import type { DayType } from "./types";

export type CalendarRow = { date: string; type: DayType; label?: string };

export type ParsedCalendar = {
  rows: CalendarRow[];
  startDate?: string;
  endDate?: string;
  name?: string;
};

const ALIASES: Record<string, DayType> = {
  lectivo: "lectivo",
  clase: "lectivo",
  "dia de clase": "lectivo",
  "día de clase": "lectivo",
  cte: "cte",
  "consejo tecnico": "cte",
  "consejo técnico": "cte",
  "consejo tecnico escolar": "cte",
  "consejo técnico escolar": "cte",
  cte_intensivo: "cte_intensivo",
  "cte intensivo": "cte_intensivo",
  "fase intensiva": "cte_intensivo",
  evaluacion: "evaluacion",
  evaluación: "evaluacion",
  "registro de evaluaciones": "evaluacion",
  "registro de calificaciones": "evaluacion",
  "descarga administrativa": "evaluacion",
  suspension: "suspension",
  suspensión: "suspension",
  "suspension oficial": "suspension",
  "suspensión oficial": "suspension",
  festivo: "suspension",
  feriado: "suspension",
  inhabil: "suspension",
  receso: "receso",
  vacaciones: "receso",
  taller: "taller",
  "taller intensivo": "taller",
  incapacidad: "incapacidad",
  permiso: "permiso_economico",
  "permiso economico": "permiso_economico",
  "permiso económico": "permiso_economico",
  permiso_economico: "permiso_economico",
  supervision: "supervision",
  supervisión: "supervision",
  "reunion en supervision": "supervision",
  "reunión en supervisión": "supervision",
  sindical: "sindical",
  "reunion sindical": "sindical",
  "reunión sindical": "sindical",
};

function normalizeType(raw: string): DayType | undefined {
  const key = raw.trim().toLowerCase().normalize("NFC");
  return ALIASES[key];
}

function pad(n: string) {
  return n.padStart(2, "0");
}

export function normalizeDate(raw: string): string | undefined {
  const text = raw.trim();
  const iso = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (iso) return `${iso[1]}-${pad(iso[2] ?? "")}-${pad(iso[3] ?? "")}`;
  const dmy = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) return `${dmy[3]}-${pad(dmy[2] ?? "")}-${pad(dmy[1] ?? "")}`;
  return undefined;
}

function rowFrom(dateRaw: unknown, typeRaw: unknown, labelRaw?: unknown): CalendarRow | undefined {
  if (typeof dateRaw !== "string" && typeof dateRaw !== "number") return undefined;
  const date = normalizeDate(String(dateRaw));
  if (!date || typeof typeRaw !== "string") return undefined;
  const type = normalizeType(typeRaw);
  if (!type) return undefined;
  const label = typeof labelRaw === "string" && labelRaw.trim() ? labelRaw.trim() : undefined;
  return { date, type, label };
}

function parseJson(text: string): ParsedCalendar | undefined {
  const data = JSON.parse(text) as unknown;
  if (Array.isArray(data)) {
    const rows = data.map((item) => {
      if (!item || typeof item !== "object") return undefined;
      const row = item as Record<string, unknown>;
      return rowFrom(row.fecha ?? row.date ?? row.dia, row.tipo ?? row.type, row.descripcion ?? row.label ?? row.motivo);
    }).filter((row): row is CalendarRow => Boolean(row));
    return { rows };
  }
  if (!data || typeof data !== "object") return undefined;
  const obj = data as Record<string, unknown>;
  const list = (obj.dias ?? obj.days ?? obj.calendario) as unknown;
  if (!Array.isArray(list)) return undefined;
  const rows = list.map((item) => {
    if (!item || typeof item !== "object") return undefined;
    const row = item as Record<string, unknown>;
    return rowFrom(row.fecha ?? row.date ?? row.dia, row.tipo ?? row.type, row.descripcion ?? row.label ?? row.motivo);
  }).filter((row): row is CalendarRow => Boolean(row));
  const startDate = typeof obj.inicio === "string" ? normalizeDate(obj.inicio) : typeof obj.startDate === "string" ? normalizeDate(obj.startDate) : undefined;
  const endDate = typeof obj.fin === "string" ? normalizeDate(obj.fin) : typeof obj.endDate === "string" ? normalizeDate(obj.endDate) : undefined;
  const name = typeof obj.nombre === "string" ? obj.nombre : typeof obj.name === "string" ? obj.name : undefined;
  return { rows, startDate, endDate, name };
}

function parseDelimited(text: string): CalendarRow[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const rows: CalendarRow[] = [];
  for (const line of lines) {
    if (/^fecha|^date|^d[ií]a/i.test(line)) continue;
    const parts = line.split(/[,;\t|]/).map((part) => part.trim().replace(/^"|"$/g, ""));
    if (parts.length < 2) continue;
    const row = rowFrom(parts[0], parts[1], parts.slice(2).join(" "));
    if (row) rows.push(row);
  }
  return rows;
}

export function parseCalendarText(text: string): ParsedCalendar {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = parseJson(trimmed);
      if (parsed && parsed.rows.length) return parsed;
    } catch {
      /* csv fallback */
    }
  }
  return { rows: parseDelimited(trimmed) };
}

export function sampleCalendarCsv(): string {
  return [
    "fecha,tipo,descripcion",
    "2026-08-24,cte_intensivo,CTE fase intensiva",
    "2026-08-31,lectivo,Inicio de clases",
    "2026-09-16,suspension,Independencia de México",
    "2026-09-25,cte,Consejo Técnico Escolar",
    "2026-11-13,evaluacion,Registro de calificaciones",
    "2026-12-21,receso,Vacaciones de invierno",
    "2027-07-09,lectivo,Fin de clases",
  ].join("\n");
}
