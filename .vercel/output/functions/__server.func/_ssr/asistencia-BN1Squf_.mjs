import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as ChevronLeft, g as ChevronRight, p as Download } from "../_libs/lucide-react.mjs";
import { A as weekdayShort, C as clampDate, E as monthBounds, O as parseISO, S as addDays, T as formatShort, b as MONTHS_ES_LIST, d as downloadFile, f as DAY_META, g as isAttendanceDay, i as effectiveMark, k as todayISO, l as cn, n as useSchoolStore, o as isImplicitAbsence, s as markAt, w as formatLong } from "./router-gsbDTyuP.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { t as useCycleContext } from "./selectors-iUN_y0c5.mjs";
import { t as monthlyAttendanceCsv } from "./export-XlbY8Nsq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asistencia-BN1Squf_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OPTIONS = [
	{
		mark: "P",
		label: "P",
		className: "data-[on=true]:bg-present data-[on=true]:text-primary-fg"
	},
	{
		mark: "A",
		label: "A",
		className: "data-[on=true]:bg-absent data-[on=true]:text-primary-fg"
	},
	{
		mark: "J",
		label: "J",
		className: "data-[on=true]:bg-justified data-[on=true]:text-primary-fg"
	},
	{
		mark: "R",
		label: "R",
		className: "data-[on=true]:bg-late data-[on=true]:text-primary-fg"
	}
];
function MarkButtons({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-4 gap-1",
		children: OPTIONS.map((opt) => {
			const on = value === opt.mark;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-on": on,
				"aria-label": opt.mark,
				"aria-pressed": on,
				onClick: () => onChange(on ? void 0 : opt.mark),
				className: cn("h-11 rounded-md border border-border bg-surface text-sm font-semibold text-muted", opt.className),
				children: opt.label
			}, opt.mark);
		})
	});
}
function AsistenciaPage() {
	const { cycle, groups, activeStudents, today } = useCycleContext();
	const school = useSchoolStore((s) => s.school);
	const attendance = useSchoolStore((s) => s.attendance);
	const setMark = useSchoolStore((s) => s.setMark);
	const markAllPresent = useSchoolStore((s) => s.markAllPresent);
	const [date, setDate] = (0, import_react.useState)(today);
	const [groupId, setGroupId] = (0, import_react.useState)("all");
	const [view, setView] = (0, import_react.useState)("dia");
	if (!cycle) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Primero crea un ciclo escolar." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ciclos",
				children: "Ciclos"
			})
		})]
	});
	const safeDate = clampDate(date, cycle.calendarStart, cycle.endDate);
	const entry = cycle.calendar[safeDate];
	const lectivo = isAttendanceDay(entry);
	const filtered = activeStudents.filter((s) => groupId === "all" || s.groupId === groupId);
	const month = parseISO(safeDate).getMonth();
	const year = parseISO(safeDate).getFullYear();
	const { start: monthStart } = monthBounds(year, month);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Asistencia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: ["Ciclo ", cycle.name]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-md border border-border bg-surface p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
						active: view === "dia",
						onClick: () => setView("dia"),
						children: "Día"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
						active: view === "mes",
						onClick: () => setView("mes"),
						children: "Mes"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: groupId === "all",
					onClick: () => setGroupId("all"),
					children: "Todos"
				}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: groupId === g.id,
					onClick: () => setGroupId(g.id),
					children: g.shortName
				}, g.id))]
			}),
			view === "dia" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": "Día anterior",
							onClick: () => setDate(addDays(safeDate, -1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-semibold capitalize",
								children: formatLong(safeDate)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-medium text-primary",
									onClick: () => setDate(todayISO()),
									children: "Ir a hoy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									"aria-label": "Elegir fecha",
									className: "h-8 rounded-md border border-border bg-surface px-2 text-xs text-fg",
									value: safeDate,
									min: cycle.calendarStart,
									max: cycle.endDate,
									onChange: (e) => {
										if (e.target.value) setDate(e.target.value);
									}
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": "Día siguiente",
							onClick: () => setDate(addDays(safeDate, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
						})
					]
				}),
				entry && !lectivo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: DAY_META[entry.type].label
						}),
						entry.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: entry.label
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "No se toma asistencia. Este día no cuenta como falta para el alumnado."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/calendario",
								children: "Editar el calendario"
							})
						})
					]
				}) : null,
				lectivo && filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "No hay alumnos para pasar lista"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/alumnos",
							children: "Agregar alumnos"
						})
					})]
				}) : null,
				lectivo && filtered.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "P presente · A ausente · J justificada · R retardo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => markAllPresent(filtered.map((s) => s.id), safeDate),
						children: "Todos presentes"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: filtered.map((student) => {
						const group = groups.find((g) => g.id === student.groupId);
						const stored = markAt(attendance, student.id, safeDate);
						const implicit = isImplicitAbsence(attendance, student.id, safeDate);
						const shown = stored ?? (implicit ? "A" : void 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 flex items-start justify-between gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [
										student.familyName,
										" ",
										student.givenName
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [group?.shortName, implicit ? " · sin registro: falta" : ""]
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkButtons, {
								value: shown,
								onChange: (mark) => {
									if (!stored && mark === void 0) {
										setMark(student.id, safeDate, "A");
										return;
									}
									setMark(student.id, safeDate, mark);
								}
							})]
						}) }, student.id);
					})
				})] }) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": "Mes anterior",
							onClick: () => setDate(addDays(monthStart, -1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-xl font-semibold capitalize",
							children: [
								MONTHS_ES_LIST[month],
								" ",
								year
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": "Mes siguiente",
							onClick: () => setDate(addDays(monthBounds(year, month).end, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: () => {
						const csv = monthlyAttendanceCsv({
							school,
							cycleName: cycle.name,
							year,
							month,
							students: filtered,
							groups,
							calendar: cycle.calendar,
							attendance
						});
						downloadFile(`asistencia-${cycle.name}-${year}-${String(month + 1).padStart(2, "0")}.csv`, csv);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Descargar CSV del mes"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthGrid, {
					year,
					month,
					groups,
					groupId,
					students: filtered,
					calendar: cycle.calendar,
					attendance,
					onMark: setMark,
					onSelectDate: (iso) => {
						setDate(iso);
						setView("dia");
					}
				})
			] })
		]
	});
}
function MonthGrid({ year, month, groups, groupId, students, calendar, attendance, onMark, onSelectDate }) {
	const { start, end } = monthBounds(year, month);
	const days = (0, import_react.useMemo)(() => {
		const list = [];
		let iso = start;
		while (iso <= end) {
			list.push(iso);
			iso = addDays(iso, 1);
		}
		return list;
	}, [start, end]);
	if (students.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Agrega alumnos para ver la lista mensual." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "min-w-max border-collapse text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "sticky left-0 z-10 min-w-40 bg-surface-2 px-3 py-3 text-left font-medium",
					children: "Alumno"
				}), days.map((iso) => {
					const lectivo = isAttendanceDay(calendar[iso]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "min-w-11 px-1 py-2 text-center font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelectDate(iso),
							className: "block w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block capitalize text-subtle",
								children: weekdayShort(iso).slice(0, 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("tabular-nums", !lectivo && "text-subtle"),
								children: formatShort(iso).split(" ")[0]
							})]
						})
					}, iso);
				})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: students.map((student) => {
					const group = groups.find((g) => g.id === student.groupId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "sticky left-0 z-10 bg-surface px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium",
								children: [
									student.familyName,
									" ",
									student.givenName
								]
							}), groupId === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: group?.shortName
							}) : null]
						}), days.map((iso) => {
							const lectivo = isAttendanceDay(calendar[iso]);
							const stored = markAt(attendance, student.id, iso);
							const mark = lectivo ? stored ?? effectiveMark(attendance, student.id, iso) : void 0;
							const implicit = lectivo && isImplicitAbsence(attendance, student.id, iso);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-0.5 py-1 text-center",
								children: lectivo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										if (implicit) {
											onMark(student.id, iso, "P");
											return;
										}
										const order = [
											"P",
											"A",
											"J",
											"R",
											void 0
										];
										const idx = order.indexOf(stored);
										onMark(student.id, iso, order[(idx + 1) % order.length]);
									},
									className: cn("size-9 rounded-sm text-xs font-semibold", mark === "P" && "bg-present text-primary-fg", mark === "A" && "bg-absent text-primary-fg", mark === "J" && "bg-justified text-primary-fg", mark === "R" && "bg-late text-primary-fg", !mark && "bg-bg-warm text-subtle", implicit && "ring-1 ring-absent/40"),
									children: mark ?? "·"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex size-9 items-center justify-center text-subtle",
									children: "–"
								})
							}, iso);
						})]
					}, student.id);
				}) })]
			})
		})
	});
}
function Tab({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("rounded-sm px-3 py-1.5 text-xs font-medium", active ? "bg-primary text-primary-fg" : "text-muted"),
		children
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-sm font-medium", active ? "bg-primary text-primary-fg" : "bg-surface text-muted border border-border"),
		children
	});
}
//#endregion
export { AsistenciaPage as component };
