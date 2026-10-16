import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { l as cn } from "./router-gsbDTyuP.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Button } from "./card-Bq9eqBvT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-_kro8aco.js
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, title, description, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-fg/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-card focus:outline-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-xl font-semibold tracking-tight",
				children: title
			}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "mt-1 text-sm text-muted",
				children: description
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "sr-only",
				children: title
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Cerrar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})
			})]
		}), children]
	})] });
}
//#endregion
export { DialogContent as n, Dialog as t };
