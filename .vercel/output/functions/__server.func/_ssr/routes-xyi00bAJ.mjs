import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { b as CalendarDays, c as QrCode, i as UserPlus, r as Users, s as Square, t as Zap, u as Play, v as Check, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { O as parseISO, b as MONTHS_ES_LIST, f as DAY_META, g as isAttendanceDay, j as SchoolSeal, n as useSchoolStore, r as daySummary, w as formatLong, x as WEEKDAYS_ES_LIST } from "./router-gsbDTyuP.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { t as useCycleContext } from "./selectors-iUN_y0c5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-xyi00bAJ.js
var import_jsx_runtime = require_jsx_runtime();
function formatEs(iso) {
	const d = parseISO(iso);
	return `${d.getDate()} de ${MONTHS_ES_LIST[d.getMonth()]} de ${d.getFullYear()}`;
}
function welcomeName(teacher) {
	const first = teacher.replace(/^Mtra\.?\s*/i, "").trim().split(/\s+/)[0];
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-right text-sm text-muted sm:hidden",
				children: [
					weekday.charAt(0).toUpperCase() + weekday.slice(1),
					", ",
					formatEs(today)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center gap-4 rounded-2xl bg-header px-5 py-4 text-primary-fg shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolSeal, { className: "size-16 shrink-0 ring-2 ring-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-extrabold tracking-tight",
					children: [
						"¡Bienvenida, ",
						welcomeName(school.teacher),
						"!"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-primary-fg/85",
					children: [
						"Sistema de Asistencia · ",
						school.name,
						" · ",
						school.cct
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: activeStudents.length,
						label: "Alumnos",
						accent: "border-t-primary",
						tone: "text-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: summary?.present ?? 0,
						label: "Asistencias hoy",
						accent: "border-t-present",
						tone: "text-present"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: summary?.lectivo ? summary.absent ?? 0 : 0,
						label: "Faltas hoy",
						accent: "border-t-absent",
						tone: "text-absent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: summary?.late ?? 0,
						label: "Retardos hoy",
						accent: "border-t-late",
						tone: "text-late"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-lg font-extrabold text-sep",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5" }), " Ciclo activo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-border" }),
						cycle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-2xl font-extrabold text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5" }), cycle.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 text-primary" }),
										"Inicio: ",
										formatEs(cycle.startDate)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-fg text-fg" }),
										"Fin: ",
										formatEs(cycle.endDate)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-late" }),
										"Alumnos: ",
										activeStudents.length
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "mt-2 rounded-lg border-primary px-4 text-primary",
									onClick: () => setActiveCycle(cycle.id),
									children: "Establecer como activo"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Aún no hay un ciclo activo."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/ciclos",
								children: "Crear ciclo"
							})
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-h-56 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 text-lg font-extrabold text-sep",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5" }), " Hoy en el calendario"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sr-only",
							children: formatLong(today)
						}),
						entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${lectivo ? "bg-present/10 text-present" : "bg-absent-soft text-absent"}`,
							children: [lectivo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : null, lectivo ? entry.label || "Día escolar normal" : DAY_META[entry.type].label]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Este día no está en el calendario del ciclo."
						}),
						!lectivo && entry?.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: entry.label
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-lg font-extrabold text-sep",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-5 text-late" }), " Acceso rápido"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/asistencia",
								className: "inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " Pasar asistencia hoy"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/alumnos",
								className: "inline-flex h-11 items-center gap-2 rounded-lg bg-present px-4 text-sm font-bold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), " Agregar alumno"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/reportes",
								className: "inline-flex h-11 items-center gap-2 rounded-lg bg-report px-4 text-sm font-bold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" }), " Ver reportes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/nfc",
								className: "inline-flex h-11 items-center gap-2 rounded-lg bg-late px-4 text-sm font-bold text-primary-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4" }), " Imprimir QR/NFC"]
							})
						]
					})
				]
			})
		]
	});
}
function Stat({ n, label, accent, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `border-t-4 p-4 text-center ${accent}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `text-4xl font-extrabold tabular-nums ${tone}`,
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs font-bold tracking-wide text-muted uppercase",
			children: label
		})]
	});
}
//#endregion
export { Home as component };
