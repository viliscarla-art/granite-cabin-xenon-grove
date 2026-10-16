import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as cn } from "./router-gsbDTyuP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/select-field-D7s6viTk.js
var import_jsx_runtime = require_jsx_runtime();
function SelectField({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35", className),
		...props,
		children
	});
}
//#endregion
export { SelectField as t };
