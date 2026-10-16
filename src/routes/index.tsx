import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, CalendarDays, Check, Play, QrCode, Square, UserPlus, Users, Zap } from "lucide-react";
import { daySummary } from "@/lib/attendance";
import { DAY_META, isAttendanceDay } from "@/lib/calendar-sep";
import { formatLong, MONTHS_ES_LIST, parseISO, WEEKDAYS_ES_LIST } from "@/lib/dates";
import { useCycleContext } from "@/lib/selectors";
import { useSchoolStore } from "@/lib/store";
import { SchoolSeal } from "@/components/school-seal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({ component: Home });

function formatEs(iso: string) {
  const d = parseISO(iso);
  return `${d.getDate()} de ${MONTHS_ES_LIST[d.getMonth()]} de ${d.getFullYear()}`;
}

function welcomeName(teacher: string) {
  const cleaned = teacher.replace(/^Mtra\.?\s*/i, "").trim();
  const first = cleaned.split(/\s+/)[0];
  return first ? `Mtra. ${first}` : "maestra";
}

function Home() {
  const school = useSchoolStore((s) => s.school);
  const attendance = useSchoolStore((s) => s.attendance);
  const setActiveCycle = useSchoolStore((s) => s.setActiveCycle);
  const { cycle, activeStudents, today } = useCycleContext();
  const summary = cycle ? daySummary(activeStudents, today, cycle.calendar, attendance) : null;
  const entry = cycle?.calendar[today];
  const lectivo = isAttendanceDay(entry);
  const weekday = WEEKDAYS_ES_LIST[parseISO(today).getDay()] ?? "";

  return (
    <div className="space-y-4">
      <p className="text-right text-sm text-muted sm:hidden">
        {weekday.charAt(0).toUpperCase() + weekday.slice(1)}, {formatEs(today)}
      </p>

      <section className="flex items-center gap-4 rounded-2xl bg-header px-5 py-4 text-primary-fg shadow-card">
        <SchoolSeal className="size-16 shrink-0 ring-2 ring-white" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">¡Bienvenida, {welcomeName(school.teacher)}!</h1>
          <p className="text-sm text-primary-fg/85">
            Sistema de Asistencia · {school.name} · {school.cct}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat n={activeStudents.length} label="Alumnos" accent="border-t-primary" tone="text-primary" />
        <Stat n={summary?.present ?? 0} label="Asistencias hoy" accent="border-t-present" tone="text-present" />
        <Stat n={summary?.lectivo ? (summary.absent ?? 0) : 0} label="Faltas hoy" accent="border-t-absent" tone="text-absent" />
        <Stat n={summary?.late ?? 0} label="Retardos hoy" accent="border-t-late" tone="text-late" />
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-sep">
            <CalendarDays className="size-5" /> Ciclo activo
          </h2>
          <div className="my-3 h-px bg-border" />
          {cycle ? (
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-2xl font-extrabold text-primary">
                <CalendarDays className="size-5" />
                {cycle.name}
              </p>
              <p className="flex items-center gap-2">
                <Play className="size-4 text-primary" />
                Inicio: {formatEs(cycle.startDate)}
              </p>
              <p className="flex items-center gap-2">
                <Square className="size-3.5 fill-fg text-fg" />
                Fin: {formatEs(cycle.endDate)}
              </p>
              <p className="flex items-center gap-2">
                <Users className="size-4 text-late" />
                Alumnos: {activeStudents.length}
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-lg border-primary px-4 text-primary"
                onClick={() => setActiveCycle(cycle.id)}
              >
                Establecer como activo
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted">Aún no hay un ciclo activo.</p>
              <Button className="mt-3" asChild>
                <Link to="/ciclos">Crear ciclo</Link>
              </Button>
            </div>
          )}
        </Card>

        <Card className="min-h-56 p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-sep">
            <CalendarDays className="size-5" /> Hoy en el calendario
          </h2>
          <div className="my-3 h-px bg-border" />
          <p className="sr-only">{formatLong(today)}</p>
          {entry ? (
            <p
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                lectivo ? "bg-present/10 text-present" : "bg-absent-soft text-absent"
              }`}
            >
              {lectivo ? <Check className="size-4" /> : null}
              {lectivo ? entry.label || "Día escolar normal" : DAY_META[entry.type].label}
            </p>
          ) : (
            <p className="text-sm text-muted">Este día no está en el calendario del ciclo.</p>
          )}
          {!lectivo && entry?.label ? <p className="mt-2 text-sm text-muted">{entry.label}</p> : null}
        </Card>
      </section>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-sep">
          <Zap className="size-5 text-late" /> Acceso rápido
        </h2>
        <div className="my-3 h-px bg-border" />
        <div className="flex flex-wrap gap-2">
          <Link to="/asistencia" className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-fg">
            <Check className="size-4" /> Pasar asistencia hoy
          </Link>
          <Link to="/alumnos" className="inline-flex h-11 items-center gap-2 rounded-lg bg-present px-4 text-sm font-bold text-primary-fg">
            <UserPlus className="size-4" /> Agregar alumno
          </Link>
          <Link to="/reportes" className="inline-flex h-11 items-center gap-2 rounded-lg bg-report px-4 text-sm font-bold text-primary-fg">
            <BarChart3 className="size-4" /> Ver reportes
          </Link>
          <Link to="/nfc" className="inline-flex h-11 items-center gap-2 rounded-lg bg-late px-4 text-sm font-bold text-primary-fg">
            <QrCode className="size-4" /> Imprimir QR/NFC
          </Link>
        </div>
      </Card>
    </div>
  );
}

function Stat({ n, label, accent, tone }: { n: number; label: string; accent: string; tone: string }) {
  return (
    <Card className={`border-t-4 p-4 text-center ${accent}`}>
      <p className={`text-4xl font-extrabold tabular-nums ${tone}`}>{n}</p>
      <p className="mt-1 text-xs font-bold tracking-wide text-muted uppercase">{label}</p>
    </Card>
  );
}
