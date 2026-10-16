import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DayBadge } from "@/components/day-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countLectivos, DAY_META, MANUAL_DAY_TYPES, markedDays } from "@/lib/calendar-sep";
import { addDays, formatLong, formatShort, monthBounds, MONTHS_ES_LIST, parseISO, todayISO } from "@/lib/dates";
import { useCycleContext } from "@/lib/selectors";
import { useSchoolStore } from "@/lib/store";
import type { DayType } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendario")({ component: CalendarioPage });

function CalendarioPage() {
  const { cycle, lectivos } = useCycleContext();
  const setDay = useSchoolStore((s) => s.setDay);
  const restoreDay = useSchoolStore((s) => s.restoreDay);
  const today = todayISO();
  const [cursor, setCursor] = useState(() => (cycle ? clampMonth(today, cycle.calendarStart, cycle.endDate) : today));
  const [selected, setSelected] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  if (!cycle) {
    return (
      <Card className="p-6">
        <p>Crea un ciclo para ver el calendario SEP.</p>
        <Button className="mt-3" asChild>
          <Link to="/ciclos">Ciclos</Link>
        </Button>
      </Card>
    );
  }

  const d = parseISO(cursor);
  const year = d.getFullYear();
  const month = d.getMonth();
  const { start, end } = monthBounds(year, month);
  const leading = parseISO(start).getDay();
  const cells = useMemo(() => {
    const list: (string | null)[] = Array.from({ length: leading }, () => null);
    let iso = start;
    while (iso <= end) {
      list.push(iso);
      iso = addDays(iso, 1);
    }
    return list;
  }, [start, end]);

  const selectedEntry = selected ? cycle.calendar[selected] : undefined;
  const elapsed = countLectivos(cycle.calendar, cycle.startDate, today < cycle.endDate ? today : cycle.endDate);
  const monthMarks = markedDays(cycle.calendar, start, end).filter(({ entry }) => entry.type !== "lectivo");

  function applyType(type: DayType) {
    if (!selected || !cycle) return;
    setDay(cycle.id, selected, type, label.trim() || undefined);
    setSelected(null);
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-semibold">Calendario</h1>
        <p className="text-sm text-muted">
          Ciclo {cycle.name} · {lectivos} días lectivos
          {cycle.officialDays ? ` (meta SEP ${cycle.officialDays})` : ""} · {elapsed} transcurridos
        </p>
      </header>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={() => setCursor(addDays(start, -1))}>
          <ChevronLeft />
        </Button>
        <h2 className="font-display text-xl font-semibold capitalize">
          {MONTHS_ES_LIST[month]} {year}
        </h2>
        <Button variant="outline" size="icon" aria-label="Mes siguiente" onClick={() => setCursor(addDays(end, 1))}>
          <ChevronRight />
        </Button>
      </div>

      <Card className="p-3">
        <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted">
          {["D", "L", "M", "M", "J", "V", "S"].map((w, i) => (
            <div key={`${w}-${i}`}>{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((iso, i) => {
            if (!iso) return <div key={`e-${i}`} />;
            const entry = cycle.calendar[iso];
            const inCycle = iso >= cycle.calendarStart && iso <= cycle.endDate;
            const isToday = iso === today;
            const tone = entry ? DAY_META[entry.type].tone : "weekend";
            return (
              <button
                key={iso}
                type="button"
                disabled={!inCycle || !entry}
                onClick={() => {
                  setSelected(iso);
                  setLabel(entry?.label ?? "");
                }}
                className={cn(
                  "flex min-h-14 flex-col items-center rounded-md border px-0.5 py-1 text-center",
                  toneClass(tone),
                  isToday && "ring-2 ring-primary ring-offset-1 ring-offset-bg",
                  !inCycle && "opacity-40",
                )}
              >
                <span className="text-sm font-semibold tabular-nums">{iso.slice(8)}</span>
                {entry && entry.type !== "lectivo" && entry.type !== "fin_de_semana" ? (
                  <span className="mt-auto text-[0.65rem] leading-tight font-medium">{DAY_META[entry.type].short}</span>
                ) : entry?.label ? (
                  <span className="mt-auto line-clamp-2 text-[0.65rem] leading-tight">{entry.label}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Legend swatch="bg-primary-soft" label="Clase" />
        <Legend swatch="bg-sep-soft" label="CTE / eval." />
        <Legend swatch="bg-break-soft" label="Suspensión / receso" />
        <Legend swatch="bg-staff-soft" label="Incapacidad / permiso" />
      </div>

      {monthMarks.length > 0 ? (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold">Marcas de este mes</h2>
          {monthMarks.map(({ iso, entry }) => (
            <button
              key={iso}
              type="button"
              className="block w-full text-left"
              onClick={() => {
                setSelected(iso);
                setLabel(entry.label ?? "");
              }}
            >
              <Card className="flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="font-medium">{DAY_META[entry.type].label}</p>
                  <p className="text-sm text-muted">{entry.label ?? formatShort(iso)}</p>
                </div>
                <span className="text-sm tabular-nums text-muted">{iso.slice(8)}</span>
              </Card>
            </button>
          ))}
        </section>
      ) : null}

      <p className="text-sm text-muted">
        Toca un día para cambiarlo. El calendario nace con CTE, suspensiones, recesos y registro de evaluaciones de la SEP;
        puedes marcar incapacidad, permiso económico, reunión en supervisión o reunión sindical.
      </p>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          title={selected ? formatLong(selected) : "Día"}
          description="El tipo define si ese día cuenta para la asistencia del alumnado."
        >
          {selectedEntry ? (
            <div className="space-y-3">
              <DayBadge entry={selectedEntry} />
              <div className="space-y-1">
                <Label htmlFor="day-label">Nota (opcional)</Label>
                <Input
                  id="day-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ej. Junta con supervisión zona 12"
                />
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {MANUAL_DAY_TYPES.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => applyType(opt.type)}
                    className={cn(
                      "rounded-md border border-border px-3 py-2.5 text-left",
                      selectedEntry.type === opt.type ? "border-primary bg-primary-soft" : "bg-surface",
                    )}
                  >
                    <span className="block text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-muted">{opt.hint}</span>
                  </button>
                ))}
              </div>
              {selectedEntry.source === "manual" && selectedEntry.officialType ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (selected) restoreDay(cycle.id, selected);
                    setSelected(null);
                  }}
                >
                  Restaurar marca oficial SEP
                </Button>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function toneClass(tone: string) {
  if (tone === "class") return "border-primary/20 bg-primary-soft text-primary";
  if (tone === "sep") return "border-transparent bg-sep-soft text-sep";
  if (tone === "break") return "border-transparent bg-break-soft text-break";
  if (tone === "staff") return "border-transparent bg-staff-soft text-staff";
  return "border-transparent bg-bg-warm text-subtle";
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={cn("size-2.5 rounded-sm", swatch)} />
      {label}
    </span>
  );
}

function clampMonth(iso: string, start: string, end: string) {
  if (iso < start) return start;
  if (iso > end) return end;
  return iso;
}
