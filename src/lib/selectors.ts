import { useMemo } from "react";
import { countLectivos, lectivoDates } from "./calendar-sep";
import { todayISO } from "./dates";
import { useSchoolStore } from "./store";

export function useCycleContext() {
  const cycles = useSchoolStore((s) => s.cycles);
  const activeCycleId = useSchoolStore((s) => s.activeCycleId);
  const allGroups = useSchoolStore((s) => s.groups);
  const allStudents = useSchoolStore((s) => s.students);

  return useMemo(() => {
    const cycle = cycles.find((c) => c.id === activeCycleId) ?? null;
    const groups = allGroups
      .filter((g) => g.cycleId === cycle?.id)
      .sort((a, b) => a.grade.localeCompare(b.grade));
    const students = allStudents
      .filter((s) => s.cycleId === cycle?.id)
      .sort((a, b) => `${a.familyName} ${a.givenName}`.localeCompare(`${b.familyName} ${b.givenName}`, "es"));
    const activeStudents = students.filter((s) => s.active);
    const lectivos = cycle ? countLectivos(cycle.calendar, cycle.startDate, cycle.endDate) : 0;
    const today = todayISO();
    const elapsed = cycle ? lectivoDates(cycle.calendar, cycle.startDate, today <= cycle.endDate ? today : cycle.endDate).length : 0;
    return { cycle, groups, students, activeStudents, lectivos, elapsed, today };
  }, [cycles, activeCycleId, allGroups, allStudents]);
}
