import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as downloadFile, n as useSchoolStore } from "./router-gsbDTyuP.mjs";
import { n as Card, t as Button } from "./card-Bq9eqBvT.mjs";
import { t as Input } from "./input-Dvg-zAJC.mjs";
import { t as Label } from "./label-BKemB3HI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/escuela-CR6hVvyi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EscuelaPage() {
	const school = useSchoolStore((s) => s.school);
	const updateSchool = useSchoolStore((s) => s.updateSchool);
	const exportSnapshot = useSchoolStore((s) => s.exportSnapshot);
	const importSnapshot = useSchoolStore((s) => s.importSnapshot);
	const fileRef = (0, import_react.useRef)(null);
	const [message, setMessage] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Datos de la escuela"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Se usan en listas, reportes y el encabezado."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nombre del jardín",
						value: school.name,
						onChange: (v) => updateSchool({ name: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nombre corto",
						value: school.shortName,
						onChange: (v) => updateSchool({ shortName: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Clave de centro de trabajo",
						value: school.cct,
						onChange: (v) => updateSchool({ cct: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Organización",
						value: school.organization,
						onChange: (v) => updateSchool({ organization: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nivel",
						value: school.level,
						onChange: (v) => updateSchool({ level: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Docente",
						value: school.teacher,
						onChange: (v) => updateSchool({ teacher: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Localidad",
						value: school.locality,
						onChange: (v) => updateSchool({ locality: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Entidad",
						value: school.state,
						onChange: (v) => updateSchool({ state: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Los cambios se guardan solos en este dispositivo."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Respaldo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "La lista vive en este celular o computadora. Antes de cambiar de aparato, descarga un respaldo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									downloadFile(`respaldo-jtb-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, exportSnapshot(), "application/json");
									setMessage("Respaldo descargado.");
								},
								children: "Descargar respaldo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => fileRef.current?.click(),
								children: "Restaurar respaldo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "application/json,.json",
								className: "hidden",
								onChange: (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (!file) return;
									file.text().then((text) => {
										importSnapshot(text);
										setMessage("Respaldo restaurado.");
									}).catch(() => setMessage("No se pudo leer el archivo."));
								}
							})
						]
					}),
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-primary",
						children: message
					}) : null
				]
			})
		]
	});
}
function Field({ label, value, onChange }) {
	const id = label.replace(/\s+/g, "-").toLowerCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
//#endregion
export { EscuelaPage as component };
