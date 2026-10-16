import { isAttendanceDay, lectivoDates } from "./calendar-sep";
import { todayISO } from "./dates";
import type { AttendanceMap, AttendanceMark, CalendarMap, Student } from "./types";

export function studentKey(studentId: string, date: string): string {
  return `${studentId}:${date}`;
}

export function markAt(attendance: AttendanceMap, studentId: string, date: string): AttendanceMark | undefined {
  return attendance[studentKey(studentId, date)];
}

/** Un día lectivo ya transcurrido sin marca cuenta como falta. */
export function effectiveMark(
  attendance: AttendanceMap,
  studentId: string,
  iso: string,
  today = todayISO(),
): AttendanceMark | undefined {
  const stored = markAt(attendance, studentId, iso);
  if (stored) return stored;
  if (iso <= today) return "A";
  return undefined;
}

export function isImplicitAbsence(
  attendance: AttendanceMap,
  studentId: string,
  iso: string,
  today = todayISO(),
): boolean {
  return !markAt(attendance, studentId, iso) && iso <= today;
}

export function cycleMark(current: AttendanceMark | undefined): AttendanceMark | undefined {
  if (!current) return "P";
  if (current === "P") return "A";
  if (current === "A") return "J";
  if (current === "J") return "R";
  return undefined;
}

export type StudentStats = {
  present: number;
  absent: number;
  justified: number;
  late: number;
  blank: number;
  lectivos: number;
  countedPresent: number;
  percent: number;
  status: "alta" | "regular" | "riesgo" | "sin_datos";
};

export function studentStats(
  student: Student,
  calendar: CalendarMap,
  attendance: AttendanceMap,
  from?: string,
  to?: string,
): StudentStats {
  const days = lectivoDates(calendar, from, to);
  const today = todayISO();
  const closed = days.filter((iso) => iso <= today);
  let present = 0;
  let absent = 0;
  let justified = 0;
  let late = 0;
  let blank = 0;
  for (const iso of days) {
    if (iso > today) {
      blank += 1;
      continue;
    }
    const stored = markAt(attendance, student.id, iso);
    const mark = stored ?? "A";
    if (mark === "P") present += 1;
    else if (mark === "A") absent += 1;
    else if (mark === "J") justified += 1;
    else if (mark === "R") late += 1;
  }
  const lectivos = closed.length;
  const countedPresent = present + late;
  const percent = lectivos === 0 ? 0 : Math.round((countedPresent / lectivos) * 1000) / 10;
  let status: StudentStats["status"] = "sin_datos";
  if (lectivos > 0) {
    if (percent >= 90) status = "alta";
    else if (percent >= 80) status = "regular";
    else status = "riesgo";
  }
  return { present, absent, justified, late, blank, lectivos, countedPresent, percent, status };
}

export function groupAverage(stats: StudentStats[]): number {
  const usable = stats.filter((s) => s.lectivos > 0);
  if (!usable.length) return 0;
  return Math.round((usable.reduce((sum, s) => sum + s.percent, 0) / usable.length) * 10) / 10;
}

export function daySummary(
  students: Student[],
  date: string,
  calendar: CalendarMap,
  attendance: AttendanceMap,
) {
  const entry = calendar[date];
  const lectivo = isAttendanceDay(entry);
  let present = 0;
  let absent = 0;
  let justified = 0;
  let late = 0;
  let blank = 0;
  if (lectivo) {
    const today = todayISO();
    for (const student of students) {
      const stored = markAt(attendance, student.id, date);
      const mark = stored ?? (date <= today ? "A" : undefined);
      if (mark === "P") present += 1;
      else if (mark === "A") absent += 1;
      else if (mark === "J") justified += 1;
      else if (mark === "R") late += 1;
      else blank += 1;
    }
  }
  return { lectivo, entry, present, absent, justified, late, blank, total: students.length };
}

export const MARK_LABEL: Record<AttendanceMark, string> = {
  P: "Presente",
  A: "Ausente",
  J: "Justificada",
  R: "Retardo",
};
