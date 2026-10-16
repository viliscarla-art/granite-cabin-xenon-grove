import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as cn } from "./router-gsbDTyuP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/photo-BG3Keg87.js
var import_jsx_runtime = require_jsx_runtime();
var SIZE = {
	sm: "size-10 text-xs",
	md: "size-14 text-sm",
	lg: "size-36 text-3xl"
};
function StudentAvatar({ student, size = "md", className }) {
	const initials = `${student.givenName.charAt(0)}${student.familyName.charAt(0)}`.toUpperCase() || "?";
	if (student.photo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: student.photo,
		alt: "",
		className: cn("rounded-full object-cover ring-4 ring-white", SIZE[size], className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center justify-center rounded-full bg-primary-soft font-bold text-primary ring-4 ring-white", SIZE[size], className),
		children: initials
	});
}
function compressImage(file, max = 280) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, max / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(img.width * scale));
			canvas.height = Math.max(1, Math.round(img.height * scale));
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("No se pudo preparar la foto."));
				return;
			}
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .72));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("No se pudo leer la foto."));
		};
		img.src = url;
	});
}
//#endregion
export { compressImage as n, StudentAvatar as t };
