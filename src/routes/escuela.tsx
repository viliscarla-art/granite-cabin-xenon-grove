import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSchoolStore } from "@/lib/store";
import { downloadFile } from "@/lib/utils";

export const Route = createFileRoute("/escuela")({ component: EscuelaPage });

function EscuelaPage() {
  const school = useSchoolStore((s) => s.school);
  const updateSchool = useSchoolStore((s) => s.updateSchool);
  const exportSnapshot = useSchoolStore((s) => s.exportSnapshot);
  const importSnapshot = useSchoolStore((s) => s.importSnapshot);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl font-semibold">Datos de la escuela</h1>
        <p className="text-sm text-muted">Se usan en listas, reportes y el encabezado.</p>
      </header>
      <Card className="space-y-3 p-5">
        <Field label="Nombre del jardín" value={school.name} onChange={(v) => updateSchool({ name: v })} />
        <Field label="Nombre corto" value={school.shortName} onChange={(v) => updateSchool({ shortName: v })} />
        <Field label="Clave de centro de trabajo" value={school.cct} onChange={(v) => updateSchool({ cct: v })} />
        <Field label="Organización" value={school.organization} onChange={(v) => updateSchool({ organization: v })} />
        <Field label="Nivel" value={school.level} onChange={(v) => updateSchool({ level: v })} />
        <Field label="Docente" value={school.teacher} onChange={(v) => updateSchool({ teacher: v })} />
        <Field label="Localidad" value={school.locality} onChange={(v) => updateSchool({ locality: v })} />
        <Field label="Entidad" value={school.state} onChange={(v) => updateSchool({ state: v })} />
        <p className="text-xs text-muted">Los cambios se guardan solos en este dispositivo.</p>
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold">Respaldo</h2>
        <p className="text-sm text-muted">
          La lista vive en este celular o computadora. Antes de cambiar de aparato, descarga un respaldo.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              downloadFile(`respaldo-jtb-${new Date().toISOString().slice(0, 10)}.json`, exportSnapshot(), "application/json");
              setMessage("Respaldo descargado.");
            }}
          >
            Descargar respaldo
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            Restaurar respaldo
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              file
                .text()
                .then((text) => {
                  importSnapshot(text);
                  setMessage("Respaldo restaurado.");
                })
                .catch(() => setMessage("No se pudo leer el archivo."));
            }}
          />
        </div>
        {message ? <p className="text-sm text-primary">{message}</p> : null}
      </Card>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
