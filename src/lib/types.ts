export const DAY_TYPES = [
  "lectivo",
  "cte",
  "cte_intensivo",
  "evaluacion",
  "suspension",
  "receso",
  "taller",
  "incapacidad",
  "permiso_economico",
  "supervision",
  "sindical",
  "fin_de_semana",
] as const;

export type DayType = (typeof DAY_TYPES)[number];

export type DaySource = "sep" | "manual" | "generated";

export type DayEntry = {
  type: DayType;
  label?: string;
  source: DaySource;
  officialType?: DayType;
  officialLabel?: string;
};

export type CalendarMap = Record<string, DayEntry>;

export type AttendanceMark = "P" | "A" | "J" | "R";

export type GroupGrade = "1" | "2" | "3";

export type Cycle = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  calendarStart: string;
  officialDays: number;
  calendar: CalendarMap;
};

export type Group = {
  id: string;
  cycleId: string;
  grade: GroupGrade;
  name: string;
  shortName: string;
};

export type Student = {
  id: string;
  cycleId: string;
  groupId: string;
  givenName: string;
  familyName: string;
  curp?: string;
  sex?: "M" | "H";
  birthDate?: string;
  tutorName?: string;
  tutorPhone?: string;
  photo?: string;
  nfcUid?: string;
  active: boolean;
  notes?: string;
};

export type SchoolProfile = {
  name: string;
  shortName: string;
  cct: string;
  organization: string;
  level: string;
  teacher: string;
  locality: string;
  state: string;
};

export type AttendanceMap = Record<string, AttendanceMark>;
