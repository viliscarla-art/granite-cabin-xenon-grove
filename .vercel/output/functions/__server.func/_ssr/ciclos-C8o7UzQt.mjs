import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as downloadFile, h as countLectivos, m as OFFICIAL_TEMPLATES, n as useSchoolStore } from "./router-gsbDTyuP.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-_kro8aco.mjs";
import { t as Input } from "./input-Dvg-zAJC.mjs";
import { t as Label } from "./label-BKemB3HI.mjs";
import { t as SelectField } from "./select-field-D7s6viTk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ciclos-C8o7UzQt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALIASES = {
	lectivo: "lectivo",
	clase: "lectivo",
	"dia de clase": "lectivo",
	"día de clase": "lectivo",
	cte: "cte",
	"consejo tecnico": "cte",
	"consejo técnico": "cte",
	"consejo tecnico escolar": "cte",
	"consejo técnico escolar": "cte",
	cte_intensivo: "cte_intensivo",
	"cte intensivo": "cte_intensivo",
	"fase intensiva": "cte_intensivo",
	evaluacion: "evaluacion",
	evaluación: "evaluacion",
	"registro de evaluaciones": "evaluacion",
	"registro de calificaciones": "evaluacion",
	"descarga administrativa": "evaluacion",
	suspension: "suspension",
	suspensión: "suspension",
	"suspension oficial": "suspension",
	"suspensión oficial": "suspension",
	festivo: "suspension",
	feriado: "suspension",
	inhabil: "suspension",
	receso: "receso",
	vacaciones: "receso",
	taller: "taller",
	"taller intensivo": "taller",
	incapacidad: "incapacidad",
	permiso: "permiso_economico",
	"permiso economico": "permiso_economico",
	"permiso económico": "permiso_economico",
	permiso_economico: "permiso_economico",
	supervision: "supervision",
	supervisión: "supervision",
	"reunion en supervision": "supervision",
	"reunión en supervisión": "supervision",
	sindical: "sindical",
	"reunion sindical": "sindical",
	"reunión sindical": "sindical"
};
function normalizeType(raw) {
	return ALIASES[raw.trim().toLowerCase().normalize("NFC")];
}
function pad(n) {
	return n.padStart(2, "0");
}
function normalizeDate(raw) {
	const text = raw.trim();
	const iso = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
	if (iso) return `${iso[1]}-${pad(iso[2] ?? "")}-${pad(iso[3] ?? "")}`;
	const dmy = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
	if (dmy) return `${dmy[3]}-${pad(dmy[2] ?? "")}-${pad(dmy[1] ?? "")}`;
}
function rowFrom(dateRaw, typeRaw, labelRaw) {
	if (typeof dateRaw !== "string" && typeof dateRaw !== "number") return void 0;
	const date = normalizeDate(String(dateRaw));
	if (!date || typeof typeRaw !== "string") return void 0;
	const type = normalizeType(typeRaw);
	if (!type) return void 0;
	return {
		date,
		type,
		label: typeof labelRaw === "string" && labelRaw.trim() ? labelRaw.trim() : void 0
	};
}
function parseJson(text) {
	const data = JSON.parse(text);
	if (Array.isArray(data)) return { rows: data.map((item) => {
		if (!item || typeof item !== "object") return void 0;
		const row = item;
		return rowFrom(row.fecha ?? row.date ?? row.dia, row.tipo ?? row.type, row.descripcion ?? row.label ?? row.motivo);
	}).filter((row) => Boolean(row)) };
	if (!data || typeof data !== "object") return void 0;
	const obj = data;
	const list = obj.dias ?? obj.days ?? obj.calendario;
	if (!Array.isArray(list)) return void 0;
	return {
		rows: list.map((item) => {
			if (!item || typeof item !== "object") return void 0;
			const row = item;
			return rowFrom(row.fecha ?? row.date ?? row.dia, row.tipo ?? row.type, row.descripcion ?? row.label ?? row.motivo);
		}).filter((row) => Boolean(row)),
		startDate: typeof obj.inicio === "string" ? normalizeDate(obj.inicio) : typeof obj.startDate === "string" ? normalizeDate(obj.startDate) : void 0,
		endDate: typeof obj.fin === "string" ? normalizeDate(obj.fin) : typeof obj.endDate === "string" ? normalizeDate(obj.endDate) : void 0,
		name: typeof obj.nombre === "string" ? obj.nombre : typeof obj.name === "string" ? obj.name : void 0
	};
}
function parseDelimited(text) {
	const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
	const rows = [];
	for (const line of lines) {
		if (/^fecha|^date|^d[ií]a/i.test(line)) continue;
		const parts = line.split(/[,;\t|]/).map((part) => part.trim().replace(/^"|"$/g, ""));
		if (parts.length < 2) continue;
		const row = rowFrom(parts[0], parts[1], parts.slice(2).join(" "));
		if (row) rows.push(row);
	}
	return rows;
}
function parseCalendarText(text) {
	const trimmed = text.trim();
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) try {
		const parsed = parseJson(trimmed);
		if (parsed && parsed.rows.length) return parsed;
	} catch {}
	return { rows: parseDelimited(trimmed) };
}
function sampleCalendarCsv() {
	return [
		"fecha,tipo,descripcion",
		"2026-08-24,cte_intensivo,CTE fase intensiva",
		"2026-08-31,lectivo,Inicio de clases",
		"2026-09-16,suspension,Independencia de México",
		"2026-09-25,cte,Consejo Técnico Escolar",
		"2026-11-13,evaluacion,Registro de calificaciones",
		"2026-12-21,receso,Vacaciones de invierno",
		"2027-07-09,lectivo,Fin de clases"
	].join("\n");
}
function CiclosPage() {
	const cycles = useSchoolStore((s) => s.cycles);
	const students = useSchoolStore((s) => s.students);
	const activeCycleId = useSchoolStore((s) => s.activeCycleId);
	const createCycle = useSchoolStore((s) => s.createCycle);
	const setActiveCycle = useSchoolStore((s) => s.setActiveCycle);
	const deleteCycle = useSchoolStore((s) => s.deleteCycle);
	const applyCalendarRows = useSchoolStore((s) => s.applyCalendarRows);
	const fileTarget = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [template, setTemplate] = (0, import_react.useState)(OFFICIAL_TEMPLATES[0]?.name ?? "personalizado");
	const [name, setName] = (0, import_react.useState)("2027-2028");
	const [startDate, setStartDate] = (0, import_react.useState)("2027-08-30");
	const [endDate, setEndDate] = (0, import_react.useState)("2028-07-07");
	const [createGroups, setCreateGroups] = (0, import_react.useState)(true);
	const [copyFrom, setCopyFrom] = (0, import_react.useState)("");
	const [copyMode, setCopyMode] = (0, import_react.useState)("none");
	const cyclesWithStudents = cycles.filter((c) => students.some((s) => s.cycleId === c.id && s.active));
	function applyTemplate(value) {
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
			copyFromCycleId: copyFrom || void 0,
			copyMode: copyFrom ? copyMode : "none"
		});
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Ciclos escolares"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Cada ciclo tiene su calendario. Puedes cargar el oficial de la SEP o subir un archivo CSV o JSON para marcar festivos, CTE, suspensiones y evaluaciones."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => downloadFile("formato-calendario-sep.csv", sampleCalendarCsv()),
						children: "Formato CSV"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setOpen(true),
						children: "Nuevo ciclo"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: cycles.map((cycle) => {
					const lectivos = countLectivos(cycle.calendar, cycle.startDate, cycle.endDate);
					const active = cycle.id === activeCycleId;
					const n = students.filter((s) => s.cycleId === cycle.id && s.active).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: `p-4 ${active ? "border-primary" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl font-semibold",
									children: cycle.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										cycle.startDate,
										" a ",
										cycle.endDate
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm",
									children: [
										lectivos,
										" días lectivos",
										cycle.officialDays ? ` · calendario de ${cycle.officialDays} días` : "",
										n ? ` · ${n} alumnos` : ""
									]
								})
							] }), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary",
								children: "Activo"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								!active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => setActiveCycle(cycle.id),
									children: "Usar este ciclo"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => {
										fileTarget.current = cycle.id;
										fileRef.current?.click();
									},
									children: "Subir calendario"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => {
										if (confirm(`¿Eliminar el ciclo ${cycle.name}? Se borrarán grupos, alumnos y asistencias de ese ciclo.`)) deleteCycle(cycle.id);
									},
									children: "Eliminar"
								})
							]
						})]
					}) }, cycle.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: ".csv,.json,text/csv,application/json",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					const cycleId = fileTarget.current;
					e.target.value = "";
					if (!file || !cycleId) return;
					file.text().then((text) => {
						const parsed = parseCalendarText(text);
						if (!parsed.rows.length) {
							setNotice("No encontré días en el archivo. Usa fecha, tipo y descripción.");
							return;
						}
						const n = applyCalendarRows(cycleId, parsed.rows, {
							startDate: parsed.startDate,
							endDate: parsed.endDate
						});
						setNotice(`Se marcaron ${n} días en el calendario.`);
					});
				}
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-primary",
				children: notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Nuevo ciclo escolar",
					description: "Si eliges un ciclo publicado por la SEP, se cargan CTE, suspensiones, recesos y registro de evaluaciones. Después puedes editar cualquier día.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "tpl",
									children: "Plantilla"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
									id: "tpl",
									value: template,
									onChange: (e) => applyTemplate(e.target.value),
									children: [OFFICIAL_TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: t.name,
										children: ["Oficial SEP ", t.name]
									}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "personalizado",
										children: "Personalizado (generar estilo SEP)"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "cname",
									children: "Nombre"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "cname",
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "start",
										children: "Inicio de clases"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "start",
										type: "date",
										value: startDate,
										onChange: (e) => setStartDate(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "end",
										children: "Fin de clases"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "end",
										type: "date",
										value: endDate,
										onChange: (e) => setEndDate(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: createGroups,
									onChange: (e) => setCreateGroups(e.target.checked)
								}), "Formar grupos 1°, 2° y 3°"]
							}),
							cyclesWithStudents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "copyfrom",
									children: "Copiar alumnado de"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
									id: "copyfrom",
									value: copyFrom,
									onChange: (e) => {
										setCopyFrom(e.target.value);
										if (e.target.value && copyMode === "none") setCopyMode("promote");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "No copiar"
									}), cyclesWithStudents.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.name
									}, c.id))]
								})]
							}), copyFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "copymode",
									children: "Cómo copiarlos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
									id: "copymode",
									value: copyMode,
									onChange: (e) => setCopyMode(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "promote",
										children: "Promover (1°→2°, 2°→3°, 3° egresa)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "same",
										children: "Mismos grados"
									})]
								})]
							}) : null] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								onClick: submit,
								children: "Crear ciclo"
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { CiclosPage as component };
