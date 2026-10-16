import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { E as monthBounds, O as parseISO, S as addDays, T as formatShort, b as MONTHS_ES_LIST, f as DAY_META, h as countLectivos, k as todayISO, l as cn, n as useSchoolStore, p as MANUAL_DAY_TYPES, v as markedDays, w as formatLong } from "./router-gsbDTyuP.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-_kro8aco.mjs";
import { t as Input } from "./input-Dvg-zAJC.mjs";
import { t as Label } from "./label-BKemB3HI.mjs";
import { t as useCycleContext } from "./selectors-iUN_y0c5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendario-DKZ700On.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide", {
	variants: { tone: {
		default: "bg-bg-warm text-muted",
		class: "bg-primary-soft text-primary",
		sep: "bg-sep-soft text-sep",
		break: "bg-break-soft text-break",
		staff: "bg-staff-soft text-staff",
		weekend: "bg-transparent text-subtle",
		present: "bg-primary-soft text-present",
		absent: "bg-absent-soft text-absent",
		justified: "bg-justified-soft text-justified",
		late: "bg-late-soft text-late",
		danger: "bg-absent-soft text-absent"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function DayBadge({ entry, compact = false }) {
	if (!entry) return null;
	const meta = DAY_META[entry.type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: meta.tone === "class" ? "class" : meta.tone,
		children: compact ? meta.short : entry.label || meta.label
	});
}
function CalendarioPage() {
	const { cycle, lectivos } = useCycleContext();
	const setDay = useSchoolStore((s) => s.setDay);
	const restoreDay = useSchoolStore((s) => s.restoreDay);
	const today = todayISO();
	const [cursor, setCursor] = (0, import_react.useState)(() => cycle ? clampMonth(today, cycle.calendarStart, cycle.endDate) : today);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [label, setLabel] = (0, import_react.useState)("");
	if (!cycle) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Crea un ciclo para ver el calendario SEP." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ciclos",
				children: "Ciclos"
			})
		})]
	});
	const d = parseISO(cursor);
	const year = d.getFullYear();
	const month = d.getMonth();
	const { start, end } = monthBounds(year, month);
	const leading = parseISO(start).getDay();
	const cells = (0, import_react.useMemo)(() => {
		const list = Array.from({ length: leading }, () => null);
		let iso = start;
		while (iso <= end) {
			list.push(iso);
			iso = addDays(iso, 1);
		}
		return list;
	}, [start, end]);
	const selectedEntry = selected ? cycle.calendar[selected] : void 0;
	const elapsed = countLectivos(cycle.calendar, cycle.startDate, today < cycle.endDate ? today : cycle.endDate);
	const monthMarks = markedDays(cycle.calendar, start, end).filter(({ entry }) => entry.type !== "lectivo");
	function applyType(type) {
		if (!selected || !cycle) return;
		setDay(cycle.id, selected, type, label.trim() || void 0);
		setSelected(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Calendario"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Ciclo ",
					cycle.name,
					" · ",
					lectivos,
					" días lectivos",
					cycle.officialDays ? ` (meta SEP ${cycle.officialDays})` : "",
					" · ",
					elapsed,
					" transcurridos"
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Mes anterior",
						onClick: () => setCursor(addDays(start, -1)),
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
						onClick: () => setCursor(addDays(end, 1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted",
					children: [
						"D",
						"L",
						"M",
						"M",
						"J",
						"V",
						"S"
					].map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: w }, `${w}-${i}`))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1",
					children: cells.map((iso, i) => {
						if (!iso) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `e-${i}`);
						const entry = cycle.calendar[iso];
						const inCycle = iso >= cycle.calendarStart && iso <= cycle.endDate;
						const isToday = iso === today;
						const tone = entry ? DAY_META[entry.type].tone : "weekend";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !inCycle || !entry,
							onClick: () => {
								setSelected(iso);
								setLabel(entry?.label ?? "");
							},
							className: cn("flex min-h-14 flex-col items-center rounded-md border px-0.5 py-1 text-center", toneClass(tone), isToday && "ring-2 ring-primary ring-offset-1 ring-offset-bg", !inCycle && "opacity-40"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold tabular-nums",
								children: iso.slice(8)
							}), entry && entry.type !== "lectivo" && entry.type !== "fin_de_semana" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-auto text-[0.65rem] leading-tight font-medium",
								children: DAY_META[entry.type].short
							}) : entry?.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-auto line-clamp-2 text-[0.65rem] leading-tight",
								children: entry.label
							}) : null]
						}, iso);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						swatch: "bg-primary-soft",
						label: "Clase"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						swatch: "bg-sep-soft",
						label: "CTE / eval."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						swatch: "bg-break-soft",
						label: "Suspensión / receso"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						swatch: "bg-staff-soft",
						label: "Incapacidad / permiso"
					})
				]
			}),
			monthMarks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Marcas de este mes"
				}), monthMarks.map(({ iso, entry }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "block w-full text-left",
					onClick: () => {
						setSelected(iso);
						setLabel(entry.label ?? "");
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex items-center justify-between gap-3 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: DAY_META[entry.type].label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: entry.label ?? formatShort(iso)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tabular-nums text-muted",
							children: iso.slice(8)
						})]
					})
				}, iso))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Toca un día para cambiarlo. El calendario nace con CTE, suspensiones, recesos y registro de evaluaciones de la SEP; puedes marcar incapacidad, permiso económico, reunión en supervisión o reunión sindical."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(selected),
				onOpenChange: (open) => {
					if (!open) setSelected(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: selected ? formatLong(selected) : "Día",
					description: "El tipo define si ese día cuenta para la asistencia del alumnado.",
					children: selectedEntry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayBadge, { entry: selectedEntry }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "day-label",
									children: "Nota (opcional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "day-label",
									value: label,
									onChange: (e) => setLabel(e.target.value),
									placeholder: "Ej. Junta con supervisión zona 12"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-1.5",
								children: MANUAL_DAY_TYPES.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => applyType(opt.type),
									className: cn("rounded-md border border-border px-3 py-2.5 text-left", selectedEntry.type === opt.type ? "border-primary bg-primary-soft" : "bg-surface"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-medium",
										children: opt.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: opt.hint
									})]
								}, opt.type))
							}),
							selectedEntry.source === "manual" && selectedEntry.officialType ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "w-full",
								onClick: () => {
									if (selected) restoreDay(cycle.id, selected);
									setSelected(null);
								},
								children: "Restaurar marca oficial SEP"
							}) : null
						]
					}) : null
				})
			})
		]
	});
}
function toneClass(tone) {
	if (tone === "class") return "border-primary/20 bg-primary-soft text-primary";
	if (tone === "sep") return "border-transparent bg-sep-soft text-sep";
	if (tone === "break") return "border-transparent bg-break-soft text-break";
	if (tone === "staff") return "border-transparent bg-staff-soft text-staff";
	return "border-transparent bg-bg-warm text-subtle";
}
function Legend({ swatch, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-xs text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2.5 rounded-sm", swatch) }), label]
	});
}
function clampMonth(iso, start, end) {
	if (iso < start) return start;
	if (iso > end) return end;
	return iso;
}
//#endregion
export { CalendarioPage as component };
