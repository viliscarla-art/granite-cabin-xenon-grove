import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as Download } from "../_libs/lucide-react.mjs";
import { D as monthsInRange, E as monthBounds, a as groupAverage, c as studentStats, d as downloadFile, k as todayISO, l as cn, n as useSchoolStore } from "./router-gsbDTyuP.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { t as SelectField } from "./select-field-D7s6viTk.mjs";
import { t as useCycleContext } from "./selectors-iUN_y0c5.mjs";
import { n as reportsCsv } from "./export-XlbY8Nsq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reportes-BQhzVJs4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportesPage() {
	const { cycle, groups, activeStudents } = useCycleContext();
	const attendance = useSchoolStore((s) => s.attendance);
	const school = useSchoolStore((s) => s.school);
	const [groupId, setGroupId] = (0, import_react.useState)("all");
	const [month, setMonth] = (0, import_react.useState)("ciclo");
	if (!cycle) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Crea un ciclo para ver reportes." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ciclos",
				children: "Ciclos"
			})
		})]
	});
	const months = monthsInRange(cycle.startDate, cycle.endDate);
	const range = (0, import_react.useMemo)(() => {
		if (month === "ciclo") return {
			from: cycle.startDate,
			to: todayISO() < cycle.endDate ? todayISO() : cycle.endDate
		};
		const [y, m] = month.split("-").map(Number);
		const bounds = monthBounds(y, (m ?? 1) - 1);
		return {
			from: bounds.start,
			to: bounds.end
		};
	}, [
		month,
		cycle.startDate,
		cycle.endDate
	]);
	const rows = activeStudents.filter((s) => groupId === "all" || s.groupId === groupId).map((student) => ({
		student,
		group: groups.find((g) => g.id === student.groupId),
		stats: studentStats(student, cycle.calendar, attendance, range.from, range.to)
	}));
	const average = groupAverage(rows.map((r) => r.stats));
	const rangeLabel = month === "ciclo" ? "Ciclo a la fecha" : months.find((m) => m.key === month)?.label ?? month;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Reportes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						school.shortName,
						" · ",
						cycle.name
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "flex-1 sm:flex-none",
						onClick: () => {
							const csv = reportsCsv({
								school,
								cycleName: cycle.name,
								rangeLabel,
								students: rows.map((r) => r.student),
								groups,
								calendar: cycle.calendar,
								attendance,
								from: range.from,
								to: range.to
							});
							downloadFile(`porcentajes-${cycle.name}.csv`, csv);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "flex-1 sm:flex-none",
						onClick: () => window.print(),
						children: "Imprimir"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
					value: groupId,
					onChange: (e) => setGroupId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Todos los grados"
					}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: g.id,
						children: g.shortName
					}, g.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
					value: month,
					onChange: (e) => setMonth(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "ciclo",
						children: "Ciclo a la fecha"
					}), months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: m.key,
						children: m.label
					}, m.key))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Promedio de asistencia"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-3xl font-semibold tabular-nums",
						children: [average, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Alumnos en riesgo (menos de 80%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold tabular-nums",
						children: rows.filter((r) => r.stats.status === "riesgo").length
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-left text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Alumno"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: "Gpo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "P"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "A"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 text-right font-medium",
								children: "J"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-right font-medium",
								children: "%"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map(({ student, group, stats }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [
									student.familyName,
									" ",
									student.givenName
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-muted",
								children: group?.shortName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-right tabular-nums",
								children: stats.present + stats.late
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-right tabular-nums",
								children: stats.absent
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-right tabular-nums",
								children: stats.justified
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("font-semibold tabular-nums", stats.status === "riesgo" && "text-absent", stats.status === "alta" && "text-present"),
									children: [stats.percent, "%"]
								})
							})
						]
					}, student.id)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-3 py-8 text-center text-muted",
						children: "No hay alumnos en este recorte."
					}) }) : null] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "El porcentaje usa los días de clase ya transcurridos. Si no hay registro, ese día cuenta como falta. Presente y retardo suman asistencia; la falta justificada no. CTE, suspensiones, recesos e incapacidades de la docente no entran en la cuenta."
			})
		]
	});
}
//#endregion
export { ReportesPage as component };
