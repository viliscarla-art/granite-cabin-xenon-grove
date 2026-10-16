import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Pencil, l as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as useSchoolStore, y as GRADE_LABELS } from "./router-gsbDTyuP.mjs";
import { n as compressImage, t as StudentAvatar } from "./photo-BG3Keg87.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-_kro8aco.mjs";
import { n as Textarea, t as Input } from "./input-Dvg-zAJC.mjs";
import { t as Label } from "./label-BKemB3HI.mjs";
import { t as SelectField } from "./select-field-D7s6viTk.mjs";
import { t as useCycleContext } from "./selectors-iUN_y0c5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alumnos-BgxIcPAR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyForm(groupId) {
	return {
		givenName: "",
		familyName: "",
		groupId,
		curp: "",
		tutorName: "",
		tutorPhone: "",
		sex: "",
		photo: "",
		bulk: ""
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
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm(groups[0]?.id ?? ""));
	const [groupOpen, setGroupOpen] = (0, import_react.useState)(false);
	const [editingGroupId, setEditingGroupId] = (0, import_react.useState)(null);
	const [groupName, setGroupName] = (0, import_react.useState)("");
	const [groupGrade, setGroupGrade] = (0, import_react.useState)("1");
	if (!cycle) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Crea un ciclo para registrar alumnos." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ciclos",
				children: "Ciclos"
			})
		})]
	});
	function openCreate(groupId) {
		setEditing(null);
		setForm(emptyForm(groupId || groups[0]?.id || ""));
		setOpen(true);
	}
	function openEdit(student) {
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
			bulk: ""
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
				curp: form.curp || void 0,
				tutorName: form.tutorName || void 0,
				tutorPhone: form.tutorPhone || void 0,
				sex: form.sex || void 0,
				photo: form.photo || void 0
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
			tutorName: form.tutorName || void 0,
			tutorPhone: form.tutorPhone || void 0,
			sex: form.sex || void 0,
			photo: form.photo || void 0
		});
		setOpen(false);
	}
	function saveGroup() {
		if (!cycle) return;
		if (editingGroupId) updateGroup(editingGroupId, { name: groupName.trim() || GRADE_LABELS[groupGrade].name });
		else addGroup(cycle.id, groupGrade, groupName);
		setGroupOpen(false);
		setEditingGroupId(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Alumnos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [students.filter((s) => s.active).length, " inscritos · proceso unitario"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => openCreate(),
					disabled: groups.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Alta"]
				})]
			}),
			groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Este ciclo no tiene grupos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Forma 1°, 2° y 3° para organizar la lista, o crea solo los que necesites."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								addGroup(cycle.id, "1");
								addGroup(cycle.id, "2");
								addGroup(cycle.id, "3");
							},
							children: "Crear 1°, 2° y 3°"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setEditingGroupId(null);
								setGroupGrade("1");
								setGroupName("");
								setGroupOpen(true);
							},
							children: "Un grupo"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => {
						setEditingGroupId(null);
						setGroupGrade("1");
						setGroupName("");
						setGroupOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Grupo"]
				})
			}),
			groups.map((group) => {
				const members = students.filter((s) => s.groupId === group.id && s.active);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-lg font-semibold",
							children: [
								group.shortName,
								" ",
								group.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									"aria-label": "Renombrar grupo",
									onClick: () => {
										setEditingGroupId(group.id);
										setGroupGrade(group.grade);
										setGroupName(group.name);
										setGroupOpen(true);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									"aria-label": "Eliminar grupo",
									onClick: () => {
										if (confirm(`¿Eliminar ${group.name}? Se darán de baja sus alumnos.`)) deleteGroup(group.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => openCreate(group.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Agregar"]
								})
							]
						})]
					}), members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 text-sm text-muted",
						children: [
							"Sin alumnos en ",
							GRADE_LABELS[group.grade].name.toLowerCase(),
							"."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: members.map((student, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "flex items-center justify-between gap-3 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
									student,
									size: "sm",
									className: "ring-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mr-2 tabular-nums text-subtle",
												children: [index + 1, "."]
											}),
											student.familyName,
											" ",
											student.givenName
										]
									}), student.tutorName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted",
										children: ["Tutor: ", student.tutorName]
									}) : null]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									"aria-label": "Editar",
									onClick: () => openEdit(student),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon-sm",
									"aria-label": "Baja",
									onClick: () => {
										if (confirm(`¿Dar de baja a ${student.givenName}?`)) removeStudent(student.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})]
							})]
						}) }, student.id))
					})]
				}, group.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: editing ? "Editar alumno" : "Agregar alumnos",
					description: editing ? void 0 : "Un alumno, o varios: un nombre completo por renglón.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "group",
									children: "Grupo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
									id: "group",
									value: form.groupId,
									onChange: (e) => setForm({
										...form,
										groupId: e.target.value
									}),
									children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: g.id,
										children: [
											g.shortName,
											" · ",
											g.name
										]
									}, g.id))
								})]
							}),
							!editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "bulk",
									children: "Varios (opcional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "bulk",
									value: form.bulk,
									onChange: (e) => setForm({
										...form,
										bulk: e.target.value
									}),
									placeholder: "Ana López García\nLuis Pérez Díaz"
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "given",
										children: "Nombre"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "given",
										value: form.givenName,
										onChange: (e) => setForm({
											...form,
											givenName: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "family",
										children: "Apellidos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "family",
										value: form.familyName,
										onChange: (e) => setForm({
											...form,
											familyName: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "photo",
										children: "Fotografía"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "photo",
										type: "file",
										accept: "image/*",
										onChange: (e) => {
											const file = e.target.files?.[0];
											if (!file) return;
											compressImage(file).then((photo) => setForm({
												...form,
												photo
											}));
										}
									}),
									form.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: form.photo,
										alt: "",
										className: "mt-2 size-20 rounded-full object-cover"
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "tutor",
									children: "Madre, padre o tutor"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "tutor",
									value: form.tutorName,
									onChange: (e) => setForm({
										...form,
										tutorName: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "phone",
										children: "Teléfono"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "phone",
										value: form.tutorPhone,
										onChange: (e) => setForm({
											...form,
											tutorPhone: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "sex",
										children: "Sexo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
										id: "sex",
										value: form.sex,
										onChange: (e) => setForm({
											...form,
											sex: e.target.value
										}),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Sin registrar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "M",
												children: "Mujer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "H",
												children: "Hombre"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								onClick: save,
								children: "Guardar"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: groupOpen,
				onOpenChange: setGroupOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: editingGroupId ? "Renombrar grupo" : "Nuevo grupo",
					description: "En un jardín unitario los grupos suelen ser 1°, 2° y 3° de preescolar.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ggrade",
									children: "Grado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
									id: "ggrade",
									value: groupGrade,
									disabled: Boolean(editingGroupId),
									onChange: (e) => setGroupGrade(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1",
											children: "Primer grado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2",
											children: "Segundo grado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "3",
											children: "Tercer grado"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "gname",
									children: "Nombre"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "gname",
									value: groupName,
									onChange: (e) => setGroupName(e.target.value),
									placeholder: GRADE_LABELS[groupGrade].name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								onClick: saveGroup,
								children: "Guardar grupo"
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { AlumnosPage as component };
