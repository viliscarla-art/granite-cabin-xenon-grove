import { createFileRoute, Link } from "@tanstack/react-router";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { compressImage } from "@/lib/photo";
import { effectiveMark } from "@/lib/attendance";
import { isAttendanceDay } from "@/lib/calendar-sep";
import { useCycleContext } from "@/lib/selectors";
import { useSchoolStore } from "@/lib/store";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/nfc")({ component: NfcPage });

type NdefReadingEvent = { serialNumber?: string };

type NdefReaderInstance = {
  scan: () => Promise<void>;
  onreading: ((event: NdefReadingEvent) => void) | null;
  onreadingerror: (() => void) | null;
};

function getNdefReader(): NdefReaderInstance | null {
  const Ctor = (window as unknown as { NDEFReader?: new () => NdefReaderInstance }).NDEFReader;
  if (!Ctor) return null;
  return new Ctor();
}

function NfcPage() {
  const { cycle, groups, activeStudents, today } = useCycleContext();
  const attendance = useSchoolStore((s) => s.attendance);
  const assignChip = useSchoolStore((s) => s.assignChip);
  const updateStudent = useSchoolStore((s) => s.updateStudent);
  const setMark = useSchoolStore((s) => s.setMark);
  const [mode, setMode] = useState<"registrar" | "lista" | "imprimir">("registrar");
  const [selectedId, setSelectedId] = useState(activeStudents[0]?.id ?? "");
  const [chip, setChip] = useState("");
  const [status, setStatus] = useState("");
  const [found, setFound] = useState<Student | null>(null);
  const selected = activeStudents.find((s) => s.id === selectedId) ?? null;

  function locate(serial: string) {
    const clean = serial.trim();
    const student = activeStudents.find((s) => s.nfcUid && s.nfcUid.toLowerCase() === clean.toLowerCase());
    if (!student) {
      setFound(null);
      setStatus(`No hay alumno con el chip ${clean}.`);
      return;
    }
    setFound(student);
    setStatus("");
    if (cycle && isAttendanceDay(cycle.calendar[today])) setMark(student.id, today, "P");
  }

  async function scan(onSerial: (serial: string) => void) {
    const reader = getNdefReader();
    if (!reader) {
      setStatus("Este navegador no lee NFC. Escribe el número del chip o usa el QR.");
      return;
    }
    try {
      await reader.scan();
      setStatus("Acerca el chip al teléfono…");
      reader.onreading = (event) => {
        const serial = event.serialNumber?.trim();
        if (serial) onSerial(serial);
      };
      reader.onreadingerror = () => setStatus("No se pudo leer el chip. Intenta de nuevo.");
    } catch {
      setStatus("No se pudo activar NFC. Revisa el permiso o escribe el número.");
    }
  }

  if (!cycle) {
    return (
      <Card className="p-6">
        <p>Crea un ciclo para usar NFC y QR.</p>
        <Button className="mt-3" asChild>
          <Link to="/ciclos">Ciclos</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold text-sep">NFC y QR</h1>
        <p className="text-sm text-muted">Al registrar un chip se muestra la fotografía del alumno. Ciclo {cycle.name}.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <ModeButton active={mode === "registrar"} onClick={() => setMode("registrar")}>
          Registrar chip
        </ModeButton>
        <ModeButton active={mode === "lista"} onClick={() => setMode("lista")}>
          Pasar lista
        </ModeButton>
        <ModeButton active={mode === "imprimir"} onClick={() => setMode("imprimir")}>
          Imprimir QR/NFC
        </ModeButton>
      </div>

      {mode === "registrar" ? (
        <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
          <Card className="max-h-[28rem] space-y-1 overflow-y-auto p-2">
            {activeStudents.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => {
                  setSelectedId(student.id);
                  setChip(student.nfcUid ?? "");
                  setStatus("");
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
                  student.id === selected?.id ? "bg-primary-soft" : ""
                }`}
              >
                <StudentAvatar student={student} size="sm" className="ring-0" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {student.familyName} {student.givenName}
                  </span>
                  <span className="text-xs text-muted">{student.nfcUid ? `Chip ${student.nfcUid}` : "Sin chip"}</span>
                </span>
              </button>
            ))}
            {activeStudents.length === 0 ? <p className="p-3 text-sm text-muted">Agrega alumnos primero.</p> : null}
          </Card>

          <Card className="flex flex-col items-center p-6 text-center">
            {selected ? (
              <>
                <p className="mb-3 text-xs font-bold tracking-wide text-muted uppercase">Fotografía del alumno</p>
                <StudentAvatar student={selected} size="lg" className="ring-primary-soft" />
                <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-lg border border-border-strong bg-surface px-4 text-sm font-bold text-primary">
                  {selected.photo ? "Cambiar fotografía" : "Subir fotografía"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file || !selected) return;
                      void compressImage(file).then((photo) => {
                        updateStudent(selected.id, { photo });
                        setStatus("Fotografía guardada.");
                      });
                    }}
                  />
                </label>
                {!selected.photo ? (
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    Sube la foto antes de guardar el chip, para identificar al alumno al pasar lista.
                  </p>
                ) : null}
                <h2 className="mt-4 text-2xl font-extrabold">
                  {selected.familyName} {selected.givenName}
                </h2>
                <p className="text-sm text-muted">{groups.find((g) => g.id === selected.groupId)?.name}</p>
                <div className="mt-4 flex w-full max-w-sm flex-col gap-2">
                  <Input
                    value={chip}
                    onChange={(e) => setChip(e.target.value)}
                    placeholder="Número del chip NFC"
                    aria-label="Número del chip NFC"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      void scan((serial) => {
                        setChip(serial);
                        setStatus("Chip leído. Confirma para guardarlo.");
                      })
                    }
                  >
                    Leer chip NFC
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!chip.trim()}
                    onClick={() => {
                      assignChip(selected.id, chip);
                      setStatus("Chip guardado.");
                    }}
                  >
                    Guardar chip
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">Elige un alumno para ver su fotografía y registrar el chip.</p>
            )}
            {status ? <p className="mt-3 text-sm font-semibold text-primary">{status}</p> : null}
          </Card>
        </div>
      ) : null}

      {mode === "lista" ? (
        <Card className="flex flex-col items-center p-6 text-center">
          <Button
            type="button"
            onClick={() =>
              void scan((serial) => {
                setChip(serial);
                locate(serial);
              })
            }
          >
            Leer chip y pasar lista
          </Button>
          <div className="mt-3 flex w-full max-w-sm gap-2">
            <Input
              value={chip}
              onChange={(e) => setChip(e.target.value)}
              placeholder="O escribe el número del chip"
              aria-label="Número del chip"
            />
            <Button type="button" variant="secondary" onClick={() => locate(chip)}>
              Buscar
            </Button>
          </div>
          {found ? (
            <div className="mt-6">
              <StudentAvatar student={found} size="lg" />
              <h2 className="mt-4 text-2xl font-extrabold">
                {found.familyName} {found.givenName}
              </h2>
              <p className="mt-1 text-lg font-bold text-present">
                {effectiveMark(attendance, found.id, today) === "P" ? "Asistencia registrada" : "Listo"}
              </p>
            </div>
          ) : null}
          {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}
        </Card>
      ) : null}

      {mode === "imprimir" ? <PrintCards students={activeStudents} groups={groups} /> : null}
    </div>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-full px-4 text-sm font-bold ${active ? "bg-primary text-primary-fg" : "bg-surface text-muted border border-border"}`}
    >
      {children}
    </button>
  );
}

function PrintCards({
  students,
  groups,
}: {
  students: Student[];
  groups: { id: string; shortName: string }[];
}) {
  const ids = useMemo(() => students.map((s) => s.id).join(","), [students]);
  const [codes, setCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next: Record<string, string> = {};
      for (const student of students) {
        next[student.id] = await QRCode.toDataURL(`jtb:${student.id}`, { margin: 1, width: 180 });
      }
      if (!cancelled) setCodes(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [ids, students]);

  return (
    <div className="space-y-3">
      <Button type="button" className="no-print" onClick={() => window.print()}>
        Imprimir credenciales
      </Button>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id} className="flex items-center gap-3 p-3">
            <StudentAvatar student={student} size="md" className="ring-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold">
                {student.familyName} {student.givenName}
              </p>
              <p className="text-xs text-muted">{groups.find((g) => g.id === student.groupId)?.shortName}</p>
              <p className="truncate text-xs text-muted">{student.nfcUid ? `NFC ${student.nfcUid}` : "Sin chip"}</p>
            </div>
            {codes[student.id] ? <img src={codes[student.id]} alt="" className="size-16" /> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
