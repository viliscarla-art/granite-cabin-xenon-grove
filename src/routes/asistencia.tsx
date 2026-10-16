import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { MarkButtons } from "@/components/mark-buttons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { effectiveMark, isImplicitAbsence, markAt } from "@/lib/attendance";
import { DAY_META, isAttendanceDay } from "@/lib/calendar-sep";
import {
  addDays,
  clampDate,
  formatLong,
  formatShort,
  monthBounds,
  MONTHS_ES_LIST,
  parseISO,
  todayISO,
  weekdayShort,
} from "@/lib/dates";
import { monthlyAttendanceCsv } from "@/lib/export";
import { useCycleContext } from "@/lib/selectors";
import { useSchoolStore } from "@/lib/store";
import type { AttendanceMark, CalendarMap, Group, Student } from "@/lib/types";
import { cn, downloadFile } from "@/lib/utils";

export const Route = createFileRoute("/asistencia")({ component: AsistenciaPage });

function AsistenciaPage() {
  const { cycle, groups, activeStudents, today } = useCycleContext();
  const school = useSchoolStore((s) => s.school);
  const attendance = useSchoolStore((s) => s.attendance);
  const setMark = useSchoolStore((s) => s.setMark);
  const markAllPresent = useSchoolStore((s) => s.markAllPresent);
  const [date, setDate] = useState(today);
  const [groupId, setGroupId] = useState<string>("all");
  const [view, setView] = useState<"dia" | "mes">("dia");

  if (!cycle) {
    return (
      <Card className="p-6">
        <p>Primero crea un ciclo escolar.</p>
        <Button className="mt-3" asChild>
          <Link to="/ciclos">Ciclos</Link>
        </Button>
      </Card>
    );
  }

  const safeDate = clampDate(date, cycle.calendarStart, cycle.endDate);
  const entry = cycle.calendar[safeDate];
  const lectivo = isAttendanceDay(entry);
  const filtered = activeStudents.filter((s) => groupId === "all" || s.groupId === groupId);
  const month = parseISO(safeDate).getMonth();
  const year = parseISO(safeDate).getFullYear();
  const { start: monthStart } = monthBounds(year, month);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Asistencia</h1>
          <p className="text-sm text-muted">Ciclo {cycle.name}</p>
        </div>
        <div className="flex rounded-md border border-border bg-surface p-1">
          <Tab active={view === "dia"} onClick={() => setView("dia")}>
            Día
          </Tab>
          <Tab active={view === "mes"} onClick={() => setView("mes")}>
            Mes
          </Tab>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={groupId === "all"} onClick={() => setGroupId("all")}>
          Todos
        </Chip>
        {groups.map((g) => (
          <Chip key={g.id} active={groupId === g.id} onClick={() => setGroupId(g.id)}>
            {g.shortName}
          </Chip>
        ))}
      </div>

      {view === "dia" ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="icon" aria-label="Día anterior" onClick={() => setDate(addDays(safeDate, -1))}>
              <ChevronLeft />
            </Button>
            <div className="text-center">
              <p className="font-display text-lg font-semibold capitalize">{formatLong(safeDate)}</p>
              <div className="mt-1 flex items-center justify-center gap-3">
                <button type="button" className="text-xs font-medium text-primary" onClick={() => setDate(todayISO())}>
                  Ir a hoy
                </button>
                <input
                  type="date"
                  aria-label="Elegir fecha"
                  className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-fg"
                  value={safeDate}
                  min={cycle.calendarStart}
                  max={cycle.endDate}
                  onChange={(e) => {
                    if (e.target.value) setDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <Button variant="outline" size="icon" aria-label="Día siguiente" onClick={() => setDate(addDays(safeDate, 1))}>
              <ChevronRight />
            </Button>
          </div>

          {entry && !lectivo ? (
            <Card className="p-5">
              <p className="font-medium">{DAY_META[entry.type].label}</p>
              {entry.label ? <p className="mt-1 text-sm text-muted">{entry.label}</p> : null}
              <p className="mt-2 text-sm text-muted">No se toma asistencia. Este día no cuenta como falta para el alumnado.</p>
              <Button className="mt-4" variant="outline" asChild>
                <Link to="/calendario">Editar el calendario</Link>
              </Button>
            </Card>
          ) : null}

          {lectivo && filtered.length === 0 ? (
            <Card className="p-5">
              <p className="font-medium">No hay alumnos para pasar lista</p>
              <Button className="mt-3" asChild>
                <Link to="/alumnos">Agregar alumnos</Link>
              </Button>
            </Card>
          ) : null}

          {lectivo && filtered.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">P presente · A ausente · J justificada · R retardo</p>
                <Button size="sm" variant="secondary" onClick={() => markAllPresent(filtered.map((s) => s.id), safeDate)}>
                  Todos presentes
                </Button>
              </div>
              <ul className="space-y-2">
                {filtered.map((student) => {
                  const group = groups.find((g) => g.id === student.groupId);
                  const stored = markAt(attendance, student.id, safeDate);
                  const implicit = isImplicitAbsence(attendance, student.id, safeDate);
                  const shown = stored ?? (implicit ? "A" : undefined);
                  return (
                    <li key={student.id}>
                      <Card className="p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">
                              {student.familyName} {student.givenName}
                            </p>
                            <p className="text-xs text-muted">
                              {group?.shortName}
                              {implicit ? " · sin registro: falta" : ""}
                            </p>
                          </div>
                        </div>
                        <MarkButtons
                          value={shown}
                          onChange={(mark) => {
                            if (!stored && mark === undefined) {
                              setMark(student.id, safeDate, "A");
                              return;
                            }
                            setMark(student.id, safeDate, mark);
                          }}
                        />
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={() => setDate(addDays(monthStart, -1))}>
              <ChevronLeft />
            </Button>
            <h2 className="font-display text-xl font-semibold capitalize">
              {MONTHS_ES_LIST[month]} {year}
            </h2>
            <Button
              variant="outline"
              size="icon"
              aria-label="Mes siguiente"
              onClick={() => setDate(addDays(monthBounds(year, month).end, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const csv = monthlyAttendanceCsv({
                school,
                cycleName: cycle.name,
                year,
                month,
                students: filtered,
                groups,
                calendar: cycle.calendar,
                attendance,
              });
              downloadFile(`asistencia-${cycle.name}-${year}-${String(month + 1).padStart(2, "0")}.csv`, csv);
            }}
          >
            <Download /> Descargar CSV del mes
          </Button>
          <MonthGrid
            year={year}
            month={month}
            groups={groups}
            groupId={groupId}
            students={filtered}
            calendar={cycle.calendar}
            attendance={attendance}
            onMark={setMark}
            onSelectDate={(iso) => {
              setDate(iso);
              setView("dia");
            }}
          />
        </>
      )}
    </div>
  );
}

function MonthGrid({
  year,
  month,
  groups,
  groupId,
  students,
  calendar,
  attendance,
  onMark,
  onSelectDate,
}: {
  year: number;
  month: number;
  groups: Group[];
  groupId: string;
  students: Student[];
  calendar: CalendarMap;
  attendance: ReturnType<typeof useSchoolStore.getState>["attendance"];
  onMark: (studentId: string, date: string, mark: AttendanceMark | undefined) => void;
  onSelectDate: (iso: string) => void;
}) {
  const { start, end } = monthBounds(year, month);
  const days = useMemo(() => {
    const list: string[] = [];
    let iso = start;
    while (iso <= end) {
      list.push(iso);
      iso = addDays(iso, 1);
    }
    return list;
  }, [start, end]);

  if (students.length === 0) {
    return (
      <Card className="p-5">
        <p>Agrega alumnos para ver la lista mensual.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-max border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-40 bg-surface-2 px-3 py-3 text-left font-medium">Alumno</th>
              {days.map((iso) => {
                const lectivo = isAttendanceDay(calendar[iso]);
                return (
                  <th key={iso} className="min-w-11 px-1 py-2 text-center font-medium">
                    <button type="button" onClick={() => onSelectDate(iso)} className="block w-full">
                      <span className="block capitalize text-subtle">{weekdayShort(iso).slice(0, 1)}</span>
                      <span className={cn("tabular-nums", !lectivo && "text-subtle")}>{formatShort(iso).split(" ")[0]}</span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const group = groups.find((g) => g.id === student.groupId);
              return (
                <tr key={student.id} className="border-t border-border">
                  <td className="sticky left-0 z-10 bg-surface px-3 py-2">
                    <div className="font-medium">
                      {student.familyName} {student.givenName}
                    </div>
                    {groupId === "all" ? <div className="text-xs text-muted">{group?.shortName}</div> : null}
                  </td>
                  {days.map((iso) => {
                    const lectivo = isAttendanceDay(calendar[iso]);
                    const stored = markAt(attendance, student.id, iso);
                    const mark = lectivo ? (stored ?? effectiveMark(attendance, student.id, iso)) : undefined;
                    const implicit = lectivo && isImplicitAbsence(attendance, student.id, iso);
                    return (
                      <td key={iso} className="px-0.5 py-1 text-center">
                        {lectivo ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (implicit) {
                                onMark(student.id, iso, "P");
                                return;
                              }
                              const order: (AttendanceMark | undefined)[] = ["P", "A", "J", "R", undefined];
                              const idx = order.indexOf(stored);
                              onMark(student.id, iso, order[(idx + 1) % order.length]);
                            }}
                            className={cn(
                              "size-9 rounded-sm text-xs font-semibold",
                              mark === "P" && "bg-present text-primary-fg",
                              mark === "A" && "bg-absent text-primary-fg",
                              mark === "J" && "bg-justified text-primary-fg",
                              mark === "R" && "bg-late text-primary-fg",
                              !mark && "bg-bg-warm text-subtle",
                              implicit && "ring-1 ring-absent/40",
                            )}
                          >
                            {mark ?? "·"}
                          </button>
                        ) : (
                          <span className="inline-flex size-9 items-center justify-center text-subtle">–</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-sm px-3 py-1.5 text-xs font-medium", active ? "bg-primary text-primary-fg" : "text-muted")}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-sm font-medium",
        active ? "bg-primary text-primary-fg" : "bg-surface text-muted border border-border",
      )}
    >
      {children}
    </button>
  );
}
