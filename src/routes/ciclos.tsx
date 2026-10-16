import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { parseCalendarText, sampleCalendarCsv } from "@/lib/calendar-import";
import { OFFICIAL_TEMPLATES, countLectivos } from "@/lib/calendar-sep";
import { useSchoolStore, type CopyMode } from "@/lib/store";
import { downloadFile } from "@/lib/utils";

export const Route = createFileRoute("/ciclos")({ component: CiclosPage });

function CiclosPage() {
  const cycles = useSchoolStore((s) => s.cycles);
  const students = useSchoolStore((s) => s.students);
  const activeCycleId = useSchoolStore((s) => s.activeCycleId);
  const createCycle = useSchoolStore((s) => s.createCycle);
  const setActiveCycle = useSchoolStore((s) => s.setActiveCycle);
  const deleteCycle = useSchoolStore((s) => s.deleteCycle);
  const applyCalendarRows = useSchoolStore((s) => s.applyCalendarRows);
  const fileTarget = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState(OFFICIAL_TEMPLATES[0]?.name ?? "personalizado");
  const [name, setName] = useState("2027-2028");
  const [startDate, setStartDate] = useState("2027-08-30");
  const [endDate, setEndDate] = useState("2028-07-07");
  const [createGroups, setCreateGroups] = useState(true);
  const [copyFrom, setCopyFrom] = useState("");
  const [copyMode, setCopyMode] = useState<CopyMode>("none");

  const cyclesWithStudents = cycles.filter((c) => students.some((s) => s.cycleId === c.id && s.active));

  function applyTemplate(value: string) {
    setTemplate(value);
    const found = OFFICIAL_TEMPLATES.find((t) => t.name === value);
    if (found) {
      setName(found.name);
      setStartDate(found.startDate);
      setEndDate(found.endDate);
    }
  }

  function submit() {
    createCycle({
      name,
      startDate,
      endDate,
      mode: template !== "personalizado" && OFFICIAL_TEMPLATES.some((t) => t.name === template) ? "official" : "generated",
      createGroups,
      copyFromCycleId: copyFrom || undefined,
      copyMode: copyFrom ? copyMode : "none",
    });
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Ciclos escolares</h1>
          <p className="text-sm text-muted">
            Cada ciclo tiene su calendario. Puedes cargar el oficial de la SEP o subir un archivo CSV o JSON para marcar
            festivos, CTE, suspensiones y evaluaciones.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => downloadFile("formato-calendario-sep.csv", sampleCalendarCsv())}>
            Formato CSV
          </Button>
          <Button onClick={() => setOpen(true)}>Nuevo ciclo</Button>
        </div>
      </header>

      <ul className="space-y-2">
        {cycles.map((cycle) => {
          const lectivos = countLectivos(cycle.calendar, cycle.startDate, cycle.endDate);
          const active = cycle.id === activeCycleId;
          const n = students.filter((s) => s.cycleId === cycle.id && s.active).length;
          return (
            <li key={cycle.id}>
              <Card className={`p-4 ${active ? "border-primary" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-semibold">{cycle.name}</p>
                    <p className="text-sm text-muted">
                      {cycle.startDate} a {cycle.endDate}
                    </p>
                    <p className="mt-1 text-sm">
                      {lectivos} días lectivos
                      {cycle.officialDays ? ` · calendario de ${cycle.officialDays} días` : ""}
                      {n ? ` · ${n} alumnos` : ""}
                    </p>
                  </div>
                  {active ? (
                    <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">Activo</span>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!active ? (
                    <Button size="sm" onClick={() => setActiveCycle(cycle.id)}>
                      Usar este ciclo
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      fileTarget.current = cycle.id;
                      fileRef.current?.click();
                    }}
                  >
                    Subir calendario
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm(
                          `¿Eliminar el ciclo ${cycle.name}? Se borrarán grupos, alumnos y asistencias de ese ciclo.`,
                        )
                      ) {
                        deleteCycle(cycle.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.json,text/csv,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const cycleId = fileTarget.current;
          e.target.value = "";
          if (!file || !cycleId) return;
          void file.text().then((text) => {
            const parsed = parseCalendarText(text);
            if (!parsed.rows.length) {
              setNotice("No encontré días en el archivo. Usa fecha, tipo y descripción.");
              return;
            }
            const n = applyCalendarRows(cycleId, parsed.rows, {
              startDate: parsed.startDate,
              endDate: parsed.endDate,
            });
            setNotice(`Se marcaron ${n} días en el calendario.`);
          });
        }}
      />
      {notice ? <p className="text-sm font-semibold text-primary">{notice}</p> : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title="Nuevo ciclo escolar"
          description="Si eliges un ciclo publicado por la SEP, se cargan CTE, suspensiones, recesos y registro de evaluaciones. Después puedes editar cualquier día."
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="tpl">Plantilla</Label>
              <SelectField id="tpl" value={template} onChange={(e) => applyTemplate(e.target.value)}>
                {OFFICIAL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.name}>
                    Oficial SEP {t.name}
                  </option>
                ))}
                <option value="personalizado">Personalizado (generar estilo SEP)</option>
              </SelectField>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cname">Nombre</Label>
              <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="start">Inicio de clases</Label>
                <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="end">Fin de clases</Label>
                <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={createGroups}
                onChange={(e) => setCreateGroups(e.target.checked)}
              />
              Formar grupos 1°, 2° y 3°
            </label>
            {cyclesWithStudents.length > 0 ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="copyfrom">Copiar alumnado de</Label>
                  <SelectField
                    id="copyfrom"
                    value={copyFrom}
                    onChange={(e) => {
                      setCopyFrom(e.target.value);
                      if (e.target.value && copyMode === "none") setCopyMode("promote");
                    }}
                  >
                    <option value="">No copiar</option>
                    {cyclesWithStudents.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </SelectField>
                </div>
                {copyFrom ? (
                  <div className="space-y-1">
                    <Label htmlFor="copymode">Cómo copiarlos</Label>
                    <SelectField id="copymode" value={copyMode} onChange={(e) => setCopyMode(e.target.value as CopyMode)}>
                      <option value="promote">Promover (1°→2°, 2°→3°, 3° egresa)</option>
                      <option value="same">Mismos grados</option>
                    </SelectField>
                  </div>
                ) : null}
              </>
            ) : null}
            <Button className="w-full" onClick={submit}>
              Crear ciclo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
