import { studentStats } from "./attendance";
import { lectivoDates } from "./calendar-sep";
import { MONTHS_ES_LIST, monthBounds } from "./dates";
import { csvEscape } from "./utils";
import type { AttendanceMap, CalendarMap, Group, SchoolProfile, Student } from "./types";
import { markAt } from "./attendance";

export function monthlyAttendanceCsv(opts: {
  school: SchoolProfile;
  cycleName: string;
  year: number;
  month: number;
  students: Student[];
  groups: Group[];
  calendar: CalendarMap;
  attendance: AttendanceMap;
}): string {
  const { start, end } = monthBounds(opts.year, opts.month);
  const days = lectivoDates(opts.calendar, start, end);
  const header = [
    "No.",
    "Apellidos",
    "Nombre",
    "Grado",
    ...days.map((iso) => iso.slice(8)),
    "P",
    "A",
    "J",
    "R",
    "%",
  ];
  const rows = opts.students.map((student, i) => {
    const group = opts.groups.find((g) => g.id === student.groupId);
    const stats = studentStats(student, opts.calendar, opts.attendance, start, end);
    const marks = days.map((iso) => markAt(opts.attendance, student.id, iso) ?? "");
    return [
      i + 1,
      student.familyName,
      student.givenName,
      group?.shortName ?? "",
      ...marks,
      stats.present + stats.late,
      stats.absent,
      stats.justified,
      stats.late,
      stats.percent,
    ].map(csvEscape);
  });
  const meta = [
    csvEscape(opts.school.name),
    csvEscape(`CCT ${opts.school.cct}`),
    csvEscape(`Ciclo ${opts.cycleName}`),
    csvEscape(`${MONTHS_ES_LIST[opts.month]} ${opts.year}`),
  ].join(",");
  return `\uFEFF${meta}\n${header.map(csvEscape).join(",")}\n${rows.map((r) => r.join(",")).join("\n")}\n`;
}

export function reportsCsv(opts: {
  school: SchoolProfile;
  cycleName: string;
  rangeLabel: string;
  students: Student[];
  groups: Group[];
  calendar: CalendarMap;
  attendance: AttendanceMap;
  from: string;
  to: string;
}): string {
  const header = ["No.", "Apellidos", "Nombre", "Grado", "P", "A", "J", "R", "Sin marca", "Días lectivos", "%"];
  const rows = opts.students.map((student, i) => {
    const group = opts.groups.find((g) => g.id === student.groupId);
    const stats = studentStats(student, opts.calendar, opts.attendance, opts.from, opts.to);
    return [
      i + 1,
      student.familyName,
      student.givenName,
      group?.shortName ?? "",
      stats.present + stats.late,
      stats.absent,
      stats.justified,
      stats.late,
      stats.blank,
      stats.lectivos,
      stats.percent,
    ].map(csvEscape);
  });
  const meta = [opts.school.name, `CCT ${opts.school.cct}`, `Ciclo ${opts.cycleName}`, opts.rangeLabel]
    .map(csvEscape)
    .join(",");
  return `\uFEFF${meta}\n${header.map(csvEscape).join(",")}\n${rows.map((r) => r.join(",")).join("\n")}\n`;
}
