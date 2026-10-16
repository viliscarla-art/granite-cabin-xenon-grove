import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { groupAverage, studentStats } from "@/lib/attendance";
import { monthBounds, monthsInRange, todayISO } from "@/lib/dates";
import { reportsCsv } from "@/lib/export";
import { useCycleContext } from "@/lib/selectors";
import { useSchoolStore } from "@/lib/store";
import { cn, downloadFile } from "@/lib/utils";

export const Route = createFileRoute("/reportes")({ component: ReportesPage });

function ReportesPage() {
  const { cycle, groups, activeStudents } = useCycleContext();
  const attendance = useSchoolStore((s) => s.attendance);
  const school = useSchoolStore((s) => s.school);
  const [groupId, setGroupId] = useState("all");
  const [month, setMonth] = useState("ciclo");

  if (!cycle) {
    return (
      <Card className="p-6">
        <p>Crea un ciclo para ver reportes.</p>
        <Button className="mt-3" asChild>
          <Link to="/ciclos">Ciclos</Link>
        </Button>
      </Card>
    );
  }

  const months = monthsInRange(cycle.startDate, cycle.endDate);
  const range = useMemo(() => {
    if (month === "ciclo") return { from: cycle.startDate, to: todayISO() < cycle.endDate ? todayISO() : cycle.endDate };
    const [y, m] = month.split("-").map(Number);
    const bounds = monthBounds(y, (m ?? 1) - 1);
    return { from: bounds.start, to: bounds.end };
  }, [month, cycle.startDate, cycle.endDate]);

  const rows = activeStudents
    .filter((s) => groupId === "all" || s.groupId === groupId)
    .map((student) => ({
      student,
      group: groups.find((g) => g.id === student.groupId),
      stats: studentStats(student, cycle.calendar, attendance, range.from, range.to),
    }));
  const average = groupAverage(rows.map((r) => r.stats));
  const rangeLabel = month === "ciclo" ? "Ciclo a la fecha" : (months.find((m) => m.key === month)?.label ?? month);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Reportes</h1>
          <p className="text-sm text-muted">
            {school.shortName} · {cycle.name}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => {
              const csv = reportsCsv({
                school,
                cycleName: cycle.name,
                rangeLabel,
                students: rows.map((r) => r.student),
                groups,
                calendar: cycle.calendar,
                attendance,
                from: range.from,
                to: range.to,
              });
              downloadFile(`porcentajes-${cycle.name}.csv`, csv);
            }}
          >
            <Download /> CSV
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => window.print()}>
            Imprimir
          </Button>
        </div>
      </header>

      <div className="no-print grid grid-cols-2 gap-2">
        <SelectField value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="all">Todos los grados</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.shortName}
            </option>
          ))}
        </SelectField>
        <SelectField value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="ciclo">Ciclo a la fecha</option>
          {months.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card className="p-4">
          <p className="text-xs text-muted">Promedio de asistencia</p>
          <p className="font-display text-3xl font-semibold tabular-nums">{average}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Alumnos en riesgo (menos de 80%)</p>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {rows.filter((r) => r.stats.status === "riesgo").length}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Alumno</th>
              <th className="px-2 py-2 font-medium">Gpo</th>
              <th className="px-2 py-2 text-right font-medium">P</th>
              <th className="px-2 py-2 text-right font-medium">A</th>
              <th className="px-2 py-2 text-right font-medium">J</th>
              <th className="px-3 py-2 text-right font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ student, group, stats }) => (
              <tr key={student.id} className="border-t border-border">
                <td className="px-3 py-2">
                  {student.familyName} {student.givenName}
                </td>
                <td className="px-2 py-2 text-muted">{group?.shortName}</td>
                <td className="px-2 py-2 text-right tabular-nums">{stats.present + stats.late}</td>
                <td className="px-2 py-2 text-right tabular-nums">{stats.absent}</td>
                <td className="px-2 py-2 text-right tabular-nums">{stats.justified}</td>
                <td className="px-3 py-2 text-right">
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      stats.status === "riesgo" && "text-absent",
                      stats.status === "alta" && "text-present",
                    )}
                  >
                    {stats.percent}%
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted">
                  No hay alumnos en este recorte.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted">
        El porcentaje usa los días de clase ya transcurridos. Si no hay registro, ese día cuenta como falta. Presente y
        retardo suman asistencia; la falta justificada no. CTE, suspensiones, recesos e incapacidades de la docente no
        entran en la cuenta.
      </p>
    </div>
  );
}
