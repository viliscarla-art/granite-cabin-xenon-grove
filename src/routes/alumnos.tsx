import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { compressImage } from "@/lib/photo";
import { GRADE_LABELS } from "@/lib/school";
import { useCycleContext } from "@/lib/selectors";
import { useSchoolStore } from "@/lib/store";
import type { GroupGrade, Student } from "@/lib/types";

export const Route = createFileRoute("/alumnos")({ component: AlumnosPage });

function emptyForm(groupId: string) {
  return {
    givenName: "",
    familyName: "",
    groupId,
    curp: "",
    tutorName: "",
    tutorPhone: "",
    sex: "" as "" | "M" | "H",
    photo: "",
    bulk: "",
  };
}

function AlumnosPage() {
  const { cycle, groups, students } = useCycleContext();
  const addStudent = useSchoolStore((s) => s.addStudent);
  const addStudentsBulk = useSchoolStore((s) => s.addStudentsBulk);
  const updateStudent = useSchoolStore((s) => s.updateStudent);
  const removeStudent = useSchoolStore((s) => s.removeStudent);
  const addGroup = useSchoolStore((s) => s.addGroup);
  const updateGroup = useSchoolStore((s) => s.updateGroup);
  const deleteGroup = useSchoolStore((s) => s.deleteGroup);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm(groups[0]?.id ?? ""));
  const [groupOpen, setGroupOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupGrade, setGroupGrade] = useState<GroupGrade>("1");

  if (!cycle) {
    return (
      <Card className="p-6">
        <p>Crea un ciclo para registrar alumnos.</p>
        <Button className="mt-3" asChild>
          <Link to="/ciclos">Ciclos</Link>
        </Button>
      </Card>
    );
  }

  function openCreate(groupId?: string) {
    setEditing(null);
    setForm(emptyForm(groupId || groups[0]?.id || ""));
    setOpen(true);
  }

  function openEdit(student: Student) {
    setEditing(student);
    setForm({
      givenName: student.givenName,
      familyName: student.familyName,
      groupId: student.groupId,
      curp: student.curp ?? "",
      tutorName: student.tutorName ?? "",
      tutorPhone: student.tutorPhone ?? "",
      sex: student.sex ?? "",
      photo: student.photo ?? "",
      bulk: "",
    });
    setOpen(true);
  }

  function save() {
    if (!cycle) return;
    if (editing) {
      updateStudent(editing.id, {
        givenName: form.givenName,
        familyName: form.familyName,
        groupId: form.groupId,
        curp: form.curp || undefined,
        tutorName: form.tutorName || undefined,
        tutorPhone: form.tutorPhone || undefined,
        sex: form.sex || undefined,
        photo: form.photo || undefined,
      });
      setOpen(false);
      return;
    }
    if (form.bulk.trim()) {
      addStudentsBulk(cycle.id, form.groupId, form.bulk.split("\n"));
      setOpen(false);
      return;
    }
    if (!form.givenName.trim()) return;
    addStudent({
      cycleId: cycle.id,
      groupId: form.groupId,
      givenName: form.givenName,
      familyName: form.familyName,
      tutorName: form.tutorName || undefined,
      tutorPhone: form.tutorPhone || undefined,
      sex: form.sex || undefined,
      photo: form.photo || undefined,
    });
    setOpen(false);
  }

  function saveGroup() {
    if (!cycle) return;
    if (editingGroupId) {
      updateGroup(editingGroupId, { name: groupName.trim() || GRADE_LABELS[groupGrade].name });
    } else {
      addGroup(cycle.id, groupGrade, groupName);
    }
    setGroupOpen(false);
    setEditingGroupId(null);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Alumnos</h1>
          <p className="text-sm text-muted">{students.filter((s) => s.active).length} inscritos · proceso unitario</p>
        </div>
        <Button onClick={() => openCreate()} disabled={groups.length === 0}>
          <Plus /> Alta
        </Button>
      </header>

      {groups.length === 0 ? (
        <Card className="p-5">
          <p className="font-medium">Este ciclo no tiene grupos</p>
          <p className="mt-1 text-sm text-muted">Forma 1°, 2° y 3° para organizar la lista, o crea solo los que necesites.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                addGroup(cycle.id, "1");
                addGroup(cycle.id, "2");
                addGroup(cycle.id, "3");
              }}
            >
              Crear 1°, 2° y 3°
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingGroupId(null);
                setGroupGrade("1");
                setGroupName("");
                setGroupOpen(true);
              }}
            >
              Un grupo
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingGroupId(null);
              setGroupGrade("1");
              setGroupName("");
              setGroupOpen(true);
            }}
          >
            <Plus /> Grupo
          </Button>
        </div>
      )}

      {groups.map((group) => {
        const members = students.filter((s) => s.groupId === group.id && s.active);
        return (
          <section key={group.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">
                {group.shortName} {group.name}
              </h2>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Renombrar grupo"
                  onClick={() => {
                    setEditingGroupId(group.id);
                    setGroupGrade(group.grade);
                    setGroupName(group.name);
                    setGroupOpen(true);
                  }}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar grupo"
                  onClick={() => {
                    if (confirm(`¿Eliminar ${group.name}? Se darán de baja sus alumnos.`)) deleteGroup(group.id);
                  }}
                >
                  <Trash2 />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openCreate(group.id)}>
                  <Plus /> Agregar
                </Button>
              </div>
            </div>
            {members.length === 0 ? (
              <Card className="p-4 text-sm text-muted">Sin alumnos en {GRADE_LABELS[group.grade].name.toLowerCase()}.</Card>
            ) : (
              <ul className="space-y-2">
                {members.map((student, index) => (
                  <li key={student.id}>
                    <Card className="flex items-center justify-between gap-3 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <StudentAvatar student={student} size="sm" className="ring-0" />
                        <div className="min-w-0">
                        <p className="truncate font-medium">
                          <span className="mr-2 tabular-nums text-subtle">{index + 1}.</span>
                          {student.familyName} {student.givenName}
                        </p>
                        {student.tutorName ? (
                          <p className="truncate text-xs text-muted">Tutor: {student.tutorName}</p>
                        ) : null}
                        </div>
                      </div>
                      <div className="flex">
                        <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => openEdit(student)}>
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Baja"
                          onClick={() => {
                            if (confirm(`¿Dar de baja a ${student.givenName}?`)) removeStudent(student.id);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title={editing ? "Editar alumno" : "Agregar alumnos"}
          description={editing ? undefined : "Un alumno, o varios: un nombre completo por renglón."}
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="group">Grupo</Label>
              <SelectField id="group" value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.shortName} · {g.name}
                  </option>
                ))}
              </SelectField>
            </div>
            {!editing ? (
              <div className="space-y-1">
                <Label htmlFor="bulk">Varios (opcional)</Label>
                <Textarea
                  id="bulk"
                  value={form.bulk}
                  onChange={(e) => setForm({ ...form, bulk: e.target.value })}
                  placeholder={"Ana López García\nLuis Pérez Díaz"}
                />
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="given">Nombre</Label>
                <Input id="given" value={form.givenName} onChange={(e) => setForm({ ...form, givenName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="family">Apellidos</Label>
                <Input id="family" value={form.familyName} onChange={(e) => setForm({ ...form, familyName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="photo">Fotografía</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void compressImage(file).then((photo) => setForm({ ...form, photo }));
                }}
              />
              {form.photo ? (
                <img src={form.photo} alt="" className="mt-2 size-20 rounded-full object-cover" />
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="tutor">Madre, padre o tutor</Label>
              <Input id="tutor" value={form.tutorName} onChange={(e) => setForm({ ...form, tutorName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={form.tutorPhone} onChange={(e) => setForm({ ...form, tutorPhone: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sex">Sexo</Label>
                <SelectField
                  id="sex"
                  value={form.sex}
                  onChange={(e) => setForm({ ...form, sex: e.target.value as "" | "M" | "H" })}
                >
                  <option value="">Sin registrar</option>
                  <option value="M">Mujer</option>
                  <option value="H">Hombre</option>
                </SelectField>
              </div>
            </div>
            <Button className="w-full" onClick={save}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={groupOpen} onOpenChange={setGroupOpen}>
        <DialogContent
          title={editingGroupId ? "Renombrar grupo" : "Nuevo grupo"}
          description="En un jardín unitario los grupos suelen ser 1°, 2° y 3° de preescolar."
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="ggrade">Grado</Label>
              <SelectField
                id="ggrade"
                value={groupGrade}
                disabled={Boolean(editingGroupId)}
                onChange={(e) => setGroupGrade(e.target.value as GroupGrade)}
              >
                <option value="1">Primer grado</option>
                <option value="2">Segundo grado</option>
                <option value="3">Tercer grado</option>
              </SelectField>
            </div>
            <div className="space-y-1">
              <Label htmlFor="gname">Nombre</Label>
              <Input
                id="gname"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={GRADE_LABELS[groupGrade].name}
              />
            </div>
            <Button className="w-full" onClick={saveGroup}>
              Guardar grupo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
