import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { calendarFromTemplate, generateSepStyleCalendar, templateByName, OFFICIAL_TEMPLATES } from "./calendar-sep";
import { GRADE_LABELS, DEFAULT_SCHOOL } from "./school";
import type {
  AttendanceMap,
  AttendanceMark,
  Cycle,
  DayEntry,
  DayType,
  Group,
  SchoolProfile,
  Student,
} from "./types";
import { parseFullName, uid } from "./utils";
import { studentKey } from "./attendance";
import type { CalendarRow } from "./calendar-import";

export type CopyMode = "none" | "same" | "promote";

type CreateCycleInput = {
  name: string;
  startDate: string;
  endDate: string;
  mode: "official" | "generated";
  createGroups?: boolean;
  copyFromCycleId?: string;
  copyMode?: CopyMode;
};

type Snapshot = {
  school: SchoolProfile;
  cycles: Cycle[];
  activeCycleId: string | null;
  groups: Group[];
  students: Student[];
  attendance: AttendanceMap;
};

type State = Snapshot & {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  updateSchool: (patch: Partial<SchoolProfile>) => void;
  createCycle: (input: CreateCycleInput) => string;
  setActiveCycle: (id: string) => void;
  deleteCycle: (id: string) => void;
  setDay: (cycleId: string, iso: string, type: DayType, label?: string) => void;
  restoreDay: (cycleId: string, iso: string) => void;
  addGroup: (cycleId: string, grade: Group["grade"], name?: string) => string;
  updateGroup: (id: string, patch: Partial<Pick<Group, "name" | "shortName">>) => void;
  deleteGroup: (id: string) => void;
  addStudent: (input: Omit<Student, "id" | "active"> & { active?: boolean }) => string;
  addStudentsBulk: (cycleId: string, groupId: string, names: string[]) => number;
  updateStudent: (id: string, patch: Partial<Omit<Student, "id" | "cycleId">>) => void;
  removeStudent: (id: string) => void;
  setMark: (studentId: string, date: string, mark: AttendanceMark | undefined) => void;
  markAllPresent: (studentIds: string[], date: string) => void;
  assignChip: (studentId: string, nfcUid: string) => void;
  applyCalendarRows: (cycleId: string, rows: CalendarRow[], bounds?: { startDate?: string; endDate?: string }) => number;
  exportSnapshot: () => string;
  importSnapshot: (json: string) => void;
};

function seedGroups(cycleId: string): Group[] {
  return (["1", "2", "3"] as const).map((grade) => ({
    id: `g${grade}-${cycleId}`,
    cycleId,
    grade,
    name: GRADE_LABELS[grade].name,
    shortName: GRADE_LABELS[grade].shortName,
  }));
}

function seedOfficialCycles(): { cycles: Cycle[]; groups: Group[]; activeCycleId: string } {
  const cycles: Cycle[] = [];
  const groups: Group[] = [];
  for (const template of OFFICIAL_TEMPLATES) {
    const cycle: Cycle = {
      id: `ciclo-${template.id}`,
      name: template.name,
      startDate: template.startDate,
      endDate: template.endDate,
      calendarStart: template.calendarStart,
      officialDays: template.officialDays,
      calendar: calendarFromTemplate(template),
    };
    cycles.push(cycle);
    groups.push(...seedGroups(cycle.id));
  }
  const current = cycles.find((c) => c.name === "2026-2027") ?? cycles[0];
  return { cycles, groups, activeCycleId: current?.id ?? "ciclo-2026-2027" };
}

function copyStudents(opts: {
  fromCycleId: string;
  toCycleId: string;
  mode: CopyMode;
  fromGroups: Group[];
  toGroups: Group[];
  students: Student[];
}): Student[] {
  if (opts.mode === "none") return [];
  const created: Student[] = [];
  for (const student of opts.students.filter((s) => s.cycleId === opts.fromCycleId && s.active)) {
    const fromGroup = opts.fromGroups.find((g) => g.id === student.groupId);
    if (!fromGroup) continue;
    const nextGrade =
      opts.mode === "promote"
        ? fromGroup.grade === "1"
          ? "2"
          : fromGroup.grade === "2"
            ? "3"
            : null
        : fromGroup.grade;
    if (!nextGrade) continue;
    const dest = opts.toGroups.find((g) => g.grade === nextGrade);
    if (!dest) continue;
    created.push({
      ...student,
      id: uid("al"),
      cycleId: opts.toCycleId,
      groupId: dest.id,
      nfcUid: undefined,
    });
  }
  return created;
}

const seeded = seedOfficialCycles();

export const useSchoolStore = create<State>()(
  persist(
    (set, get) => ({
      school: DEFAULT_SCHOOL,
      cycles: seeded.cycles,
      activeCycleId: seeded.activeCycleId,
      groups: seeded.groups,
      students: [],
      attendance: {},
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      updateSchool: (patch) => set({ school: { ...get().school, ...patch } }),
      createCycle: (input) => {
        const official = templateByName(input.name);
        const calendar =
          input.mode === "official" && official
            ? calendarFromTemplate(official)
            : generateSepStyleCalendar(input.startDate, input.endDate);
        const startDate = official && input.mode === "official" ? official.startDate : input.startDate;
        const endDate = official && input.mode === "official" ? official.endDate : input.endDate;
        const calendarStart =
          official && input.mode === "official" ? official.calendarStart : Object.keys(calendar).sort()[0] ?? startDate;
        const cycle: Cycle = {
          id: uid("ciclo"),
          name: input.name.trim() || `${startDate.slice(0, 4)}-${endDate.slice(0, 4)}`,
          startDate,
          endDate,
          calendarStart,
          officialDays: official?.officialDays ?? 185,
          calendar,
        };
        const groups =
          input.createGroups === false && !(input.copyFromCycleId && input.copyMode && input.copyMode !== "none")
            ? []
            : seedGroups(cycle.id);
        const copied = input.copyFromCycleId
          ? copyStudents({
              fromCycleId: input.copyFromCycleId,
              toCycleId: cycle.id,
              mode: input.copyMode ?? "none",
              fromGroups: get().groups.filter((g) => g.cycleId === input.copyFromCycleId),
              toGroups: groups,
              students: get().students,
            })
          : [];
        set({
          cycles: [cycle, ...get().cycles],
          groups: [...get().groups, ...groups],
          students: copied.length ? [...get().students, ...copied] : get().students,
          activeCycleId: cycle.id,
        });
        return cycle.id;
      },
      setActiveCycle: (id) => set({ activeCycleId: id }),
      deleteCycle: (id) => {
        const cycles = get().cycles.filter((c) => c.id !== id);
        const groups = get().groups.filter((g) => g.cycleId !== id);
        const remainingStudents = get().students.filter((s) => s.cycleId !== id);
        const removedIds = new Set(get().students.filter((s) => s.cycleId === id).map((s) => s.id));
        const attendance = { ...get().attendance };
        for (const key of Object.keys(attendance)) {
          const studentId = key.split(":")[0];
          if (studentId && removedIds.has(studentId)) delete attendance[key];
        }
        set({
          cycles,
          groups,
          students: remainingStudents,
          attendance,
          activeCycleId: get().activeCycleId === id ? (cycles[0]?.id ?? null) : get().activeCycleId,
        });
      },
      setDay: (cycleId, iso, type, label) => {
        set({
          cycles: get().cycles.map((cycle) => {
            if (cycle.id !== cycleId) return cycle;
            const previous = cycle.calendar[iso];
            const next: DayEntry = {
              type,
              label: label ?? previous?.label,
              source: "manual",
              officialType: previous?.officialType ?? previous?.type,
              officialLabel: previous?.officialLabel ?? previous?.label,
            };
            return { ...cycle, calendar: { ...cycle.calendar, [iso]: next } };
          }),
        });
      },
      restoreDay: (cycleId, iso) => {
        set({
          cycles: get().cycles.map((cycle) => {
            if (cycle.id !== cycleId) return cycle;
            const previous = cycle.calendar[iso];
            if (!previous?.officialType) return cycle;
            const next: DayEntry = {
              type: previous.officialType,
              label: previous.officialLabel,
              source: "sep",
              officialType: previous.officialType,
              officialLabel: previous.officialLabel,
            };
            return { ...cycle, calendar: { ...cycle.calendar, [iso]: next } };
          }),
        });
      },
      addGroup: (cycleId, grade, name) => {
        const meta = GRADE_LABELS[grade];
        const group: Group = {
          id: uid(`g${grade}`),
          cycleId,
          grade,
          name: name?.trim() || meta.name,
          shortName: meta.shortName,
        };
        set({ groups: [...get().groups, group] });
        return group.id;
      },
      updateGroup: (id, patch) => {
        set({
          groups: get().groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        });
      },
      deleteGroup: (id) => {
        const students = get().students.filter((s) => s.groupId !== id);
        const removedIds = new Set(get().students.filter((s) => s.groupId === id).map((s) => s.id));
        const attendance = { ...get().attendance };
        for (const key of Object.keys(attendance)) {
          if (removedIds.has(key.split(":")[0] ?? "")) delete attendance[key];
        }
        set({
          groups: get().groups.filter((g) => g.id !== id),
          students,
          attendance,
        });
      },
      addStudent: (input) => {
        const student: Student = {
          ...input,
          id: uid("al"),
          givenName: input.givenName.trim(),
          familyName: input.familyName.trim(),
          active: input.active ?? true,
        };
        set({ students: [...get().students, student] });
        return student.id;
      },
      addStudentsBulk: (cycleId, groupId, names) => {
        const created: Student[] = [];
        for (const raw of names) {
          const line = raw.trim();
          if (!line) continue;
          const { givenName, familyName } = parseFullName(line);
          created.push({
            id: uid("al"),
            cycleId,
            groupId,
            givenName,
            familyName,
            active: true,
          });
        }
        if (created.length) set({ students: [...get().students, ...created] });
        return created.length;
      },
      updateStudent: (id, patch) => {
        set({
          students: get().students.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        });
      },
      removeStudent: (id) => {
        const attendance = { ...get().attendance };
        for (const key of Object.keys(attendance)) {
          if (key.startsWith(`${id}:`)) delete attendance[key];
        }
        set({
          students: get().students.filter((s) => s.id !== id),
          attendance,
        });
      },
      setMark: (studentId, date, mark) => {
        const attendance = { ...get().attendance };
        const key = studentKey(studentId, date);
        if (!mark) delete attendance[key];
        else attendance[key] = mark;
        set({ attendance });
      },
      markAllPresent: (studentIds, date) => {
        const attendance = { ...get().attendance };
        for (const id of studentIds) attendance[studentKey(id, date)] = "P";
        set({ attendance });
      },
      assignChip: (studentId, nfcUid) => {
        const clean = nfcUid.trim();
        set({
          students: get().students.map((s) => {
            if (s.id === studentId) return { ...s, nfcUid: clean || undefined };
            if (clean && s.nfcUid && s.nfcUid.toLowerCase() === clean.toLowerCase()) return { ...s, nfcUid: undefined };
            return s;
          }),
        });
      },
      applyCalendarRows: (cycleId, rows, bounds) => {
        let applied = 0;
        set({
          cycles: get().cycles.map((cycle) => {
            if (cycle.id !== cycleId) return cycle;
            const calendar = { ...cycle.calendar };
            for (const row of rows) {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) continue;
              const next: DayEntry = {
                type: row.type,
                label: row.label,
                source: "sep",
                officialType: row.type,
                officialLabel: row.label,
              };
              calendar[row.date] = next;
              applied += 1;
            }
            return {
              ...cycle,
              calendar,
              startDate: bounds?.startDate || cycle.startDate,
              endDate: bounds?.endDate || cycle.endDate,
            };
          }),
        });
        return applied;
      },
      exportSnapshot: () =>
        JSON.stringify(
          {
            version: 2,
            exportedAt: new Date().toISOString(),
            school: get().school,
            cycles: get().cycles,
            activeCycleId: get().activeCycleId,
            groups: get().groups,
            students: get().students,
            attendance: get().attendance,
          },
          null,
          2,
        ),
      importSnapshot: (json) => {
        const data = JSON.parse(json) as Partial<Snapshot> & { version?: number };
        if (!data || !Array.isArray(data.cycles) || !Array.isArray(data.groups)) {
          throw new Error("El archivo no parece un respaldo de Lista JTB.");
        }
        set({
          school: data.school ?? get().school,
          cycles: data.cycles,
          activeCycleId: data.activeCycleId ?? data.cycles[0]?.id ?? null,
          groups: data.groups,
          students: Array.isArray(data.students) ? data.students : [],
          attendance: data.attendance && typeof data.attendance === "object" ? data.attendance : {},
        });
      },
    }),
    {
      name: "jtb-asistencia-v2",
      skipHydration: true,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        school: state.school,
        cycles: state.cycles,
        activeCycleId: state.activeCycleId,
        groups: state.groups,
        students: state.students,
        attendance: state.attendance,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          useSchoolStore.setState({ hydrated: true });
          return;
        }
        const school = { ...state.school };
        let changed = false;
        if (school.teacher === "Mtra. Carla Vilis Álvarez") {
          school.teacher = "Mtra. Carla Berenice Vilis Álvarez";
          changed = true;
        }
        if (school.cct === "30EJM1426K") {
          school.cct = "30EJN1426K";
          changed = true;
        }
        if (changed) useSchoolStore.setState({ school });
        useSchoolStore.setState({ hydrated: true });
      },
    },
  ),
);

export function useActiveCycle() {
  return useSchoolStore((s) => s.cycles.find((c) => c.id === s.activeCycleId) ?? null);
}
