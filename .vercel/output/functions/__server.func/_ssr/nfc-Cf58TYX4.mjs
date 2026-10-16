import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as isAttendanceDay, i as effectiveMark, n as useSchoolStore } from "./router-gsbDTyuP.mjs";
import { n as compressImage, t as StudentAvatar } from "./photo-BG3Keg87.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { t as Input } from "./input-Dvg-zAJC.mjs";
import { t as useCycleContext } from "./selectors-iUN_y0c5.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nfc-Cf58TYX4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function getNdefReader() {
	const Ctor = window.NDEFReader;
	if (!Ctor) return null;
	return new Ctor();
}
function NfcPage() {
	const { cycle, groups, activeStudents, today } = useCycleContext();
	const attendance = useSchoolStore((s) => s.attendance);
	const assignChip = useSchoolStore((s) => s.assignChip);
	const updateStudent = useSchoolStore((s) => s.updateStudent);
	const setMark = useSchoolStore((s) => s.setMark);
	const [mode, setMode] = (0, import_react.useState)("registrar");
	const [selectedId, setSelectedId] = (0, import_react.useState)(activeStudents[0]?.id ?? "");
	const [chip, setChip] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [found, setFound] = (0, import_react.useState)(null);
	const selected = activeStudents.find((s) => s.id === selectedId) ?? null;
	function locate(serial) {
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
	async function scan(onSerial) {
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
	if (!cycle) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Crea un ciclo para usar NFC y QR." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ciclos",
				children: "Ciclos"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-sep",
				children: "NFC y QR"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Al registrar un chip se muestra la fotografía del alumno. Ciclo ",
					cycle.name,
					"."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
						active: mode === "registrar",
						onClick: () => setMode("registrar"),
						children: "Registrar chip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
						active: mode === "lista",
						onClick: () => setMode("lista"),
						children: "Pasar lista"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
						active: mode === "imprimir",
						onClick: () => setMode("imprimir"),
						children: "Imprimir QR/NFC"
					})
				]
			}),
			mode === "registrar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-[280px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "max-h-[28rem] space-y-1 overflow-y-auto p-2",
					children: [activeStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setSelectedId(student.id);
							setChip(student.nfcUid ?? "");
							setStatus("");
						},
						className: `flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${student.id === selected?.id ? "bg-primary-soft" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
							student,
							size: "sm",
							className: "ring-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate text-sm font-bold",
								children: [
									student.familyName,
									" ",
									student.givenName
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: student.nfcUid ? `Chip ${student.nfcUid}` : "Sin chip"
							})]
						})]
					}, student.id)), activeStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-3 text-sm text-muted",
						children: "Agrega alumnos primero."
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col items-center p-6 text-center",
					children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs font-bold tracking-wide text-muted uppercase",
							children: "Fotografía del alumno"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
							student: selected,
							size: "lg",
							className: "ring-primary-soft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 inline-flex h-10 cursor-pointer items-center rounded-lg border border-border-strong bg-surface px-4 text-sm font-bold text-primary",
							children: [selected.photo ? "Cambiar fotografía" : "Subir fotografía", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "sr-only",
								onChange: (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (!file || !selected) return;
									compressImage(file).then((photo) => {
										updateStudent(selected.id, { photo });
										setStatus("Fotografía guardada.");
									});
								}
							})]
						}),
						!selected.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xs text-sm text-muted",
							children: "Sube la foto antes de guardar el chip, para identificar al alumno al pasar lista."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 text-2xl font-extrabold",
							children: [
								selected.familyName,
								" ",
								selected.givenName
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: groups.find((g) => g.id === selected.groupId)?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex w-full max-w-sm flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: chip,
									onChange: (e) => setChip(e.target.value),
									placeholder: "Número del chip NFC",
									"aria-label": "Número del chip NFC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: () => void scan((serial) => {
										setChip(serial);
										setStatus("Chip leído. Confirma para guardarlo.");
									}),
									children: "Leer chip NFC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									disabled: !chip.trim(),
									onClick: () => {
										assignChip(selected.id, chip);
										setStatus("Chip guardado.");
									},
									children: "Guardar chip"
								})
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Elige un alumno para ver su fotografía y registrar el chip."
					}), status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold text-primary",
						children: status
					}) : null]
				})]
			}) : null,
			mode === "lista" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col items-center p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void scan((serial) => {
							setChip(serial);
							locate(serial);
						}),
						children: "Leer chip y pasar lista"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex w-full max-w-sm gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: chip,
							onChange: (e) => setChip(e.target.value),
							placeholder: "O escribe el número del chip",
							"aria-label": "Número del chip"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => locate(chip),
							children: "Buscar"
						})]
					}),
					found ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
								student: found,
								size: "lg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-4 text-2xl font-extrabold",
								children: [
									found.familyName,
									" ",
									found.givenName
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg font-bold text-present",
								children: effectiveMark(attendance, found.id, today) === "P" ? "Asistencia registrada" : "Listo"
							})
						]
					}) : null,
					status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: status
					}) : null
				]
			}) : null,
			mode === "imprimir" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintCards, {
				students: activeStudents,
				groups
			}) : null
		]
	});
}
function ModeButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `h-10 rounded-full px-4 text-sm font-bold ${active ? "bg-primary text-primary-fg" : "bg-surface text-muted border border-border"}`,
		children
	});
}
function PrintCards({ students, groups }) {
	const ids = (0, import_react.useMemo)(() => students.map((s) => s.id).join(","), [students]);
	const [codes, setCodes] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const next = {};
			for (const student of students) next[student.id] = await import_lib.toDataURL(`jtb:${student.id}`, {
				margin: 1,
				width: 180
			});
			if (!cancelled) setCodes(next);
		})();
		return () => {
			cancelled = true;
		};
	}, [ids, students]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			className: "no-print",
			onClick: () => window.print(),
			children: "Imprimir credenciales"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center gap-3 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
						student,
						size: "md",
						className: "ring-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate font-extrabold",
								children: [
									student.familyName,
									" ",
									student.givenName
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: groups.find((g) => g.id === student.groupId)?.shortName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted",
								children: student.nfcUid ? `NFC ${student.nfcUid}` : "Sin chip"
							})
						]
					}),
					codes[student.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: codes[student.id],
						alt: "",
						className: "size-16"
					}) : null
				]
			}, student.id))
		})]
	});
}
//#endregion
export { NfcPage as component };
