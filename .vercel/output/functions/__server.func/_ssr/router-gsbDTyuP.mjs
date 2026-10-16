import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as TriangleAlert, b as CalendarDays, c as QrCode, f as House, h as ClipboardCheck, m as Cloud, r as Users, v as Check, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-gsbDTyuP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "Ocurrió un error inesperado. Recarga la página.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-absent",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-lg font-semibold",
				children: "Algo salió mal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function SchoolSeal({ className = "size-12" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/seal.jpg",
		alt: "",
		className: `rounded-full bg-white object-cover shadow-sm ${className}`
	});
}
var WEEKDAYS_ES = [
	"domingo",
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado"
];
var MONTHS_ES = [
	"enero",
	"febrero",
	"marzo",
	"abril",
	"mayo",
	"junio",
	"julio",
	"agosto",
	"septiembre",
	"octubre",
	"noviembre",
	"diciembre"
];
function parseISO(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function formatISO(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function todayISO() {
	return formatISO(/* @__PURE__ */ new Date());
}
function addDays(iso, days) {
	const d = parseISO(iso);
	d.setDate(d.getDate() + days);
	return formatISO(d);
}
function weekday(iso) {
	return parseISO(iso).getDay();
}
function isWeekend(iso) {
	const w = weekday(iso);
	return w === 0 || w === 6;
}
function eachDate(start, end) {
	const out = [];
	const last = parseISO(end);
	const d = parseISO(start);
	while (d <= last) {
		out.push(formatISO(d));
		d.setDate(d.getDate() + 1);
	}
	return out;
}
function monthBounds(year, monthIndex) {
	return {
		start: formatISO(new Date(year, monthIndex, 1)),
		end: formatISO(new Date(year, monthIndex + 1, 0))
	};
}
function monthsInRange(start, end) {
	const out = [];
	const s = parseISO(start);
	const e = parseISO(end);
	const cursor = new Date(s.getFullYear(), s.getMonth(), 1);
	while (cursor <= e) {
		const year = cursor.getFullYear();
		const month = cursor.getMonth();
		out.push({
			year,
			month,
			key: `${year}-${String(month + 1).padStart(2, "0")}`,
			label: `${MONTHS_ES[month]} ${year}`
		});
		cursor.setMonth(cursor.getMonth() + 1);
	}
	return out;
}
function weekdayShort(iso) {
	return (WEEKDAYS_ES[weekday(iso)] ?? "").slice(0, 3);
}
function formatLong(iso) {
	const d = parseISO(iso);
	return `${WEEKDAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}
function formatShort(iso) {
	const d = parseISO(iso);
	return `${d.getDate()} ${MONTHS_ES[d.getMonth()].slice(0, 3)}`;
}
function clampDate(iso, start, end) {
	if (iso < start) return start;
	if (iso > end) return end;
	return iso;
}
function lastFridayOfMonth(year, monthIndex) {
	const last = new Date(year, monthIndex + 1, 0);
	const offset = (last.getDay() + 2) % 7;
	last.setDate(last.getDate() - offset);
	return formatISO(last);
}
/** Anonymous Gregorian algorithm — returns month 3 or 4. */
function easterSunday(year) {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = (h + l - 7 * m + 114) % 31 + 1;
	return new Date(year, month - 1, day);
}
var MONTHS_ES_LIST = MONTHS_ES;
var WEEKDAYS_ES_LIST = WEEKDAYS_ES;
var DEFAULT_SCHOOL = {
	name: "Jardín de Niños Jaime Torres Bodet",
	shortName: "JDN Jaime Torres Bodet",
	cct: "30EJN1426K",
	organization: "Unitario",
	level: "Preescolar",
	teacher: "Mtra. Carla Berenice Vilis Álvarez",
	locality: "Xochitla",
	state: "Veracruz"
};
var GRADE_LABELS = {
	"1": {
		name: "Primer grado",
		shortName: "1°"
	},
	"2": {
		name: "Segundo grado",
		shortName: "2°"
	},
	"3": {
		name: "Tercer grado",
		shortName: "3°"
	}
};
var OFFICIAL_TEMPLATES = [{
	id: "2026-2027",
	name: "2026-2027",
	startDate: "2026-08-31",
	endDate: "2027-07-09",
	calendarStart: "2026-08-24",
	officialDays: 185,
	overlays: [
		{
			type: "cte_intensivo",
			start: "2026-08-24",
			end: "2026-08-28",
			label: "CTE fase intensiva"
		},
		{
			type: "lectivo",
			start: "2026-08-31",
			label: "Inicio de clases"
		},
		{
			type: "suspension",
			start: "2026-09-16",
			label: "Independencia de México"
		},
		{
			type: "cte",
			start: "2026-09-25",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "cte",
			start: "2026-10-30",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "suspension",
			start: "2026-11-02",
			label: "Día de Muertos"
		},
		{
			type: "evaluacion",
			start: "2026-11-13",
			label: "Registro de calificaciones"
		},
		{
			type: "suspension",
			start: "2026-11-16",
			label: "Revolución Mexicana"
		},
		{
			type: "cte",
			start: "2026-11-27",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "receso",
			start: "2026-12-21",
			end: "2027-01-05",
			label: "Vacaciones de invierno"
		},
		{
			type: "suspension",
			start: "2026-12-25",
			label: "Navidad"
		},
		{
			type: "suspension",
			start: "2027-01-01",
			label: "Año Nuevo"
		},
		{
			type: "suspension",
			start: "2027-01-06",
			label: "Día de Reyes"
		},
		{
			type: "cte",
			start: "2027-01-29",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "suspension",
			start: "2027-02-01",
			label: "Día de la Constitución"
		},
		{
			type: "lectivo",
			start: "2027-02-02",
			end: "2027-02-12",
			label: "Preinscripciones 2027-2028"
		},
		{
			type: "cte",
			start: "2027-02-26",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "evaluacion",
			start: "2027-03-05",
			label: "Registro de calificaciones"
		},
		{
			type: "suspension",
			start: "2027-03-15",
			label: "Natalicio de Benito Juárez"
		},
		{
			type: "receso",
			start: "2027-03-22",
			end: "2027-04-03",
			label: "Vacaciones de Semana Santa"
		},
		{
			type: "cte",
			start: "2027-04-30",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "suspension",
			start: "2027-05-05",
			label: "Batalla de Puebla"
		},
		{
			type: "cte",
			start: "2027-05-28",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "cte",
			start: "2027-06-25",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "evaluacion",
			start: "2027-07-02",
			label: "Registro de calificaciones"
		},
		{
			type: "lectivo",
			start: "2027-07-09",
			label: "Fin de clases"
		}
	]
}, {
	id: "2025-2026",
	name: "2025-2026",
	startDate: "2025-09-01",
	endDate: "2026-07-15",
	calendarStart: "2025-08-25",
	officialDays: 185,
	overlays: [
		{
			type: "cte_intensivo",
			start: "2025-08-25",
			end: "2025-08-29",
			label: "CTE fase intensiva"
		},
		{
			type: "lectivo",
			start: "2025-09-01",
			label: "Inicio de clases"
		},
		{
			type: "lectivo",
			start: "2025-09-08",
			label: "Jornada de concientización"
		},
		{
			type: "cte",
			start: "2025-09-26",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "suspension",
			start: "2025-09-16",
			label: "Independencia de México"
		},
		{
			type: "cte",
			start: "2025-10-31",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "evaluacion",
			start: "2025-11-14",
			label: "Registro de calificaciones"
		},
		{
			type: "suspension",
			start: "2025-11-17",
			label: "Revolución Mexicana"
		},
		{
			type: "cte",
			start: "2025-11-28",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "receso",
			start: "2025-12-22",
			end: "2026-01-06",
			label: "Vacaciones de invierno"
		},
		{
			type: "suspension",
			start: "2025-12-25",
			label: "Navidad"
		},
		{
			type: "suspension",
			start: "2026-01-01",
			label: "Año Nuevo"
		},
		{
			type: "taller",
			start: "2026-01-07",
			label: "Taller intensivo (dirección)"
		},
		{
			type: "taller",
			start: "2026-01-08",
			end: "2026-01-09",
			label: "Taller intensivo (docente)"
		},
		{
			type: "cte",
			start: "2026-01-30",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "suspension",
			start: "2026-02-02",
			label: "Día de la Constitución"
		},
		{
			type: "lectivo",
			start: "2026-02-03",
			end: "2026-02-13",
			label: "Preinscripciones 2026-2027"
		},
		{
			type: "cte",
			start: "2026-02-27",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "evaluacion",
			start: "2026-03-13",
			label: "Registro de calificaciones"
		},
		{
			type: "suspension",
			start: "2026-03-16",
			label: "Natalicio de Benito Juárez"
		},
		{
			type: "cte",
			start: "2026-03-27",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "receso",
			start: "2026-03-30",
			end: "2026-04-10",
			label: "Vacaciones de Semana Santa"
		},
		{
			type: "suspension",
			start: "2026-05-01",
			label: "Día del Trabajo"
		},
		{
			type: "suspension",
			start: "2026-05-05",
			label: "Batalla de Puebla"
		},
		{
			type: "suspension",
			start: "2026-05-15",
			label: "Día del Maestro"
		},
		{
			type: "cte",
			start: "2026-05-29",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "cte",
			start: "2026-06-26",
			label: "Consejo Técnico Escolar"
		},
		{
			type: "evaluacion",
			start: "2026-07-03",
			label: "Registro de calificaciones"
		},
		{
			type: "lectivo",
			start: "2026-07-15",
			label: "Fin de clases"
		}
	]
}];
function templateByName(name) {
	return OFFICIAL_TEMPLATES.find((t) => t.name === name || t.id === name);
}
var PRIORITY = {
	receso: 80,
	cte_intensivo: 70,
	taller: 65,
	cte: 60,
	evaluacion: 55,
	suspension: 50,
	incapacidad: 45,
	permiso_economico: 45,
	supervision: 45,
	sindical: 45,
	lectivo: 10,
	fin_de_semana: 5
};
function applyOverlay(map, overlay, source) {
	const dates = eachDate(overlay.start, overlay.end ?? overlay.start);
	for (const iso of dates) {
		const current = map[iso];
		if (!current) continue;
		if (current.type === "fin_de_semana" && overlay.type === "lectivo") {
			if (overlay.label) map[iso] = {
				...current,
				label: overlay.label,
				officialLabel: overlay.label
			};
			continue;
		}
		if (PRIORITY[overlay.type] < PRIORITY[current.type] && overlay.type === "lectivo") {
			if (overlay.label && !current.label) map[iso] = {
				...current,
				label: overlay.label,
				officialLabel: overlay.label
			};
			continue;
		}
		if (overlay.type === "suspension" && (current.type === "receso" || current.type === "cte")) {
			map[iso] = {
				...current,
				label: overlay.label ?? current.label,
				officialLabel: overlay.label ?? current.officialLabel
			};
			continue;
		}
		map[iso] = {
			type: overlay.type,
			label: overlay.label ?? current.label,
			source,
			officialType: overlay.type,
			officialLabel: overlay.label ?? current.officialLabel
		};
	}
}
function buildCalendar(start, end, overlays, source = "sep") {
	const map = {};
	for (const iso of eachDate(start, end)) if (isWeekend(iso)) map[iso] = {
		type: "fin_de_semana",
		source,
		officialType: "fin_de_semana"
	};
	else map[iso] = {
		type: "lectivo",
		source,
		officialType: "lectivo"
	};
	const sorted = [...overlays].sort((a, b) => PRIORITY[a.type] - PRIORITY[b.type]);
	for (const overlay of sorted) applyOverlay(map, overlay, source);
	return map;
}
function calendarFromTemplate(template) {
	return buildCalendar(template.calendarStart, template.endDate, template.overlays, "sep");
}
function mondayHoliday(year, monthIndex, nthMonday) {
	const firstMonday = 1 + (8 - new Date(year, monthIndex, 1).getDay()) % 7;
	return formatISO(new Date(year, monthIndex, firstMonday + (nthMonday - 1) * 7));
}
function generateSepStyleCalendar(startDate, endDate) {
	const start = parseISO(startDate);
	const end = parseISO(endDate);
	const calendarStart = addDays(startDate, -7);
	const overlays = [{
		type: "lectivo",
		start: startDate,
		label: "Inicio de clases"
	}, {
		type: "lectivo",
		start: endDate,
		label: "Fin de clases"
	}];
	const intensivoEnd = addDays(startDate, -3);
	const intensivoStart = addDays(intensivoEnd, -4);
	overlays.push({
		type: "cte_intensivo",
		start: intensivoStart,
		end: intensivoEnd,
		label: "CTE fase intensiva"
	});
	const cteMonths = [
		8,
		9,
		10,
		0,
		1,
		3,
		4,
		5
	];
	const years = /* @__PURE__ */ new Set([start.getFullYear(), end.getFullYear()]);
	for (const year of years) {
		for (const month of cteMonths) {
			const iso = lastFridayOfMonth(year, month);
			if (iso >= startDate && iso <= endDate) overlays.push({
				type: "cte",
				start: iso,
				label: "Consejo Técnico Escolar"
			});
		}
		overlays.push({
			type: "suspension",
			start: `${year}-09-16`,
			label: "Independencia de México"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-11-02`,
			label: "Día de Muertos"
		});
		overlays.push({
			type: "suspension",
			start: mondayHoliday(year, 10, 3),
			label: "Revolución Mexicana"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-12-25`,
			label: "Navidad"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-01-01`,
			label: "Año Nuevo"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-01-06`,
			label: "Día de Reyes"
		});
		overlays.push({
			type: "suspension",
			start: mondayHoliday(year, 1, 1),
			label: "Día de la Constitución"
		});
		overlays.push({
			type: "suspension",
			start: mondayHoliday(year, 2, 3),
			label: "Natalicio de Benito Juárez"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-05-01`,
			label: "Día del Trabajo"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-05-05`,
			label: "Batalla de Puebla"
		});
		overlays.push({
			type: "suspension",
			start: `${year}-05-15`,
			label: "Día del Maestro"
		});
		overlays.push({
			type: "receso",
			start: `${year}-12-21`,
			end: `${year + 1}-01-05`,
			label: "Vacaciones de invierno"
		});
		const easter = easterSunday(year);
		const recesoStart = new Date(easter);
		recesoStart.setDate(easter.getDate() - 6);
		const recesoEnd = new Date(easter);
		recesoEnd.setDate(easter.getDate() + 6);
		overlays.push({
			type: "receso",
			start: formatISO(recesoStart),
			end: formatISO(recesoEnd),
			label: "Vacaciones de Semana Santa"
		});
	}
	const startYear = start.getFullYear();
	overlays.push({
		type: "evaluacion",
		start: lastFridayOfMonth(startYear, 10) < `${startYear}-11-20` ? lastFridayOfMonth(startYear, 10) : `${startYear}-11-14`,
		label: "Registro de calificaciones"
	});
	overlays.push({
		type: "evaluacion",
		start: lastFridayOfMonth(end.getFullYear(), 2),
		label: "Registro de calificaciones"
	});
	overlays.push({
		type: "evaluacion",
		start: lastFridayOfMonth(end.getFullYear(), end.getMonth()) > endDate ? addDays(endDate, -7) : lastFridayOfMonth(end.getFullYear(), end.getMonth()),
		label: "Registro de calificaciones"
	});
	return buildCalendar(calendarStart < intensivoStart ? calendarStart : intensivoStart, endDate, overlays, "generated");
}
function isAttendanceDay(entry) {
	return entry?.type === "lectivo";
}
function lectivoDates(calendar, start, end) {
	return Object.keys(calendar).filter((iso) => {
		if (start && iso < start) return false;
		if (end && iso > end) return false;
		return calendar[iso]?.type === "lectivo";
	}).sort();
}
function countLectivos(calendar, start, end) {
	return lectivoDates(calendar, start, end).length;
}
function markedDays(calendar, start, end) {
	return Object.keys(calendar).filter((iso) => {
		if (start && iso < start) return false;
		if (end && iso > end) return false;
		const entry = calendar[iso];
		if (!entry) return false;
		if (entry.type === "fin_de_semana") return false;
		return entry.type !== "lectivo" || Boolean(entry.label);
	}).sort().map((iso) => ({
		iso,
		entry: calendar[iso]
	}));
}
var MANUAL_DAY_TYPES = [
	{
		type: "lectivo",
		label: "Día de clase",
		hint: "Se toma asistencia"
	},
	{
		type: "cte",
		label: "Consejo Técnico Escolar",
		hint: "Sin clases"
	},
	{
		type: "cte_intensivo",
		label: "CTE fase intensiva",
		hint: "Sin clases"
	},
	{
		type: "evaluacion",
		label: "Registro de evaluaciones",
		hint: "Descarga administrativa"
	},
	{
		type: "suspension",
		label: "Suspensión oficial",
		hint: "Día inhábil SEP"
	},
	{
		type: "receso",
		label: "Vacaciones / receso",
		hint: "Periodo vacacional"
	},
	{
		type: "taller",
		label: "Taller intensivo",
		hint: "Formación docente"
	},
	{
		type: "incapacidad",
		label: "Incapacidad",
		hint: "Ausencia médica de la docente"
	},
	{
		type: "permiso_economico",
		label: "Permiso económico",
		hint: "Permiso de la docente"
	},
	{
		type: "supervision",
		label: "Reunión en supervisión",
		hint: "Jornada en supervisión"
	},
	{
		type: "sindical",
		label: "Reunión sindical",
		hint: "Jornada sindical"
	}
];
var DAY_META = {
	lectivo: {
		label: "Día de clase",
		short: "Clase",
		tone: "class"
	},
	cte: {
		label: "Consejo Técnico",
		short: "CTE",
		tone: "sep"
	},
	cte_intensivo: {
		label: "CTE intensivo",
		short: "CTE-I",
		tone: "sep"
	},
	evaluacion: {
		label: "Registro de evaluaciones",
		short: "Eval.",
		tone: "sep"
	},
	suspension: {
		label: "Suspensión oficial",
		short: "Susp.",
		tone: "break"
	},
	receso: {
		label: "Vacaciones",
		short: "Receso",
		tone: "break"
	},
	taller: {
		label: "Taller intensivo",
		short: "Taller",
		tone: "sep"
	},
	incapacidad: {
		label: "Incapacidad",
		short: "Incap.",
		tone: "staff"
	},
	permiso_economico: {
		label: "Permiso económico",
		short: "P. ec.",
		tone: "staff"
	},
	supervision: {
		label: "Reunión en supervisión",
		short: "Superv.",
		tone: "staff"
	},
	sindical: {
		label: "Reunión sindical",
		short: "Sindical",
		tone: "staff"
	},
	fin_de_semana: {
		label: "Fin de semana",
		short: "FDS",
		tone: "weekend"
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
/** Mexican names: last two words are apellidos when there are 3+ tokens. */
function parseFullName(line) {
	const parts = line.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return {
		givenName: "",
		familyName: ""
	};
	if (parts.length === 1) return {
		givenName: parts[0] ?? "",
		familyName: ""
	};
	if (parts.length === 2) return {
		givenName: parts[0] ?? "",
		familyName: parts[1] ?? ""
	};
	return {
		givenName: parts.slice(0, -2).join(" "),
		familyName: parts.slice(-2).join(" ")
	};
}
function downloadFile(filename, contents, mime = "text/csv;charset=utf-8") {
	const blob = new Blob([contents], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function csvEscape(value) {
	const text = String(value);
	if (/[",\n]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
	return text;
}
function studentKey(studentId, date) {
	return `${studentId}:${date}`;
}
function markAt(attendance, studentId, date) {
	return attendance[studentKey(studentId, date)];
}
/** Un día lectivo ya transcurrido sin marca cuenta como falta. */
function effectiveMark(attendance, studentId, iso, today = todayISO()) {
	const stored = markAt(attendance, studentId, iso);
	if (stored) return stored;
	if (iso <= today) return "A";
}
function isImplicitAbsence(attendance, studentId, iso, today = todayISO()) {
	return !markAt(attendance, studentId, iso) && iso <= today;
}
function studentStats(student, calendar, attendance, from, to) {
	const days = lectivoDates(calendar, from, to);
	const today = todayISO();
	const closed = days.filter((iso) => iso <= today);
	let present = 0;
	let absent = 0;
	let justified = 0;
	let late = 0;
	let blank = 0;
	for (const iso of days) {
		if (iso > today) {
			blank += 1;
			continue;
		}
		const mark = markAt(attendance, student.id, iso) ?? "A";
		if (mark === "P") present += 1;
		else if (mark === "A") absent += 1;
		else if (mark === "J") justified += 1;
		else if (mark === "R") late += 1;
	}
	const lectivos = closed.length;
	const countedPresent = present + late;
	const percent = lectivos === 0 ? 0 : Math.round(countedPresent / lectivos * 1e3) / 10;
	let status = "sin_datos";
	if (lectivos > 0) {
		if (percent >= 90) status = "alta";
		else if (percent >= 80) status = "regular";
		else status = "riesgo";
	}
	return {
		present,
		absent,
		justified,
		late,
		blank,
		lectivos,
		countedPresent,
		percent,
		status
	};
}
function groupAverage(stats) {
	const usable = stats.filter((s) => s.lectivos > 0);
	if (!usable.length) return 0;
	return Math.round(usable.reduce((sum, s) => sum + s.percent, 0) / usable.length * 10) / 10;
}
function daySummary(students, date, calendar, attendance) {
	const entry = calendar[date];
	const lectivo = isAttendanceDay(entry);
	let present = 0;
	let absent = 0;
	let justified = 0;
	let late = 0;
	let blank = 0;
	if (lectivo) {
		const today = todayISO();
		for (const student of students) {
			const mark = markAt(attendance, student.id, date) ?? (date <= today ? "A" : void 0);
			if (mark === "P") present += 1;
			else if (mark === "A") absent += 1;
			else if (mark === "J") justified += 1;
			else if (mark === "R") late += 1;
			else blank += 1;
		}
	}
	return {
		lectivo,
		entry,
		present,
		absent,
		justified,
		late,
		blank,
		total: students.length
	};
}
function seedGroups(cycleId) {
	return [
		"1",
		"2",
		"3"
	].map((grade) => ({
		id: `g${grade}-${cycleId}`,
		cycleId,
		grade,
		name: GRADE_LABELS[grade].name,
		shortName: GRADE_LABELS[grade].shortName
	}));
}
function seedOfficialCycles() {
	const cycles = [];
	const groups = [];
	for (const template of OFFICIAL_TEMPLATES) {
		const cycle = {
			id: `ciclo-${template.id}`,
			name: template.name,
			startDate: template.startDate,
			endDate: template.endDate,
			calendarStart: template.calendarStart,
			officialDays: template.officialDays,
			calendar: calendarFromTemplate(template)
		};
		cycles.push(cycle);
		groups.push(...seedGroups(cycle.id));
	}
	return {
		cycles,
		groups,
		activeCycleId: (cycles.find((c) => c.name === "2026-2027") ?? cycles[0])?.id ?? "ciclo-2026-2027"
	};
}
function copyStudents(opts) {
	if (opts.mode === "none") return [];
	const created = [];
	for (const student of opts.students.filter((s) => s.cycleId === opts.fromCycleId && s.active)) {
		const fromGroup = opts.fromGroups.find((g) => g.id === student.groupId);
		if (!fromGroup) continue;
		const nextGrade = opts.mode === "promote" ? fromGroup.grade === "1" ? "2" : fromGroup.grade === "2" ? "3" : null : fromGroup.grade;
		if (!nextGrade) continue;
		const dest = opts.toGroups.find((g) => g.grade === nextGrade);
		if (!dest) continue;
		created.push({
			...student,
			id: uid("al"),
			cycleId: opts.toCycleId,
			groupId: dest.id,
			nfcUid: void 0
		});
	}
	return created;
}
var seeded = seedOfficialCycles();
var useSchoolStore = create()(persist((set, get) => ({
	school: DEFAULT_SCHOOL,
	cycles: seeded.cycles,
	activeCycleId: seeded.activeCycleId,
	groups: seeded.groups,
	students: [],
	attendance: {},
	hydrated: false,
	setHydrated: (value) => set({ hydrated: value }),
	updateSchool: (patch) => set({ school: {
		...get().school,
		...patch
	} }),
	createCycle: (input) => {
		const official = templateByName(input.name);
		const calendar = input.mode === "official" && official ? calendarFromTemplate(official) : generateSepStyleCalendar(input.startDate, input.endDate);
		const startDate = official && input.mode === "official" ? official.startDate : input.startDate;
		const endDate = official && input.mode === "official" ? official.endDate : input.endDate;
		const calendarStart = official && input.mode === "official" ? official.calendarStart : Object.keys(calendar).sort()[0] ?? startDate;
		const cycle = {
			id: uid("ciclo"),
			name: input.name.trim() || `${startDate.slice(0, 4)}-${endDate.slice(0, 4)}`,
			startDate,
			endDate,
			calendarStart,
			officialDays: official?.officialDays ?? 185,
			calendar
		};
		const groups = input.createGroups === false && !(input.copyFromCycleId && input.copyMode && input.copyMode !== "none") ? [] : seedGroups(cycle.id);
		const copied = input.copyFromCycleId ? copyStudents({
			fromCycleId: input.copyFromCycleId,
			toCycleId: cycle.id,
			mode: input.copyMode ?? "none",
			fromGroups: get().groups.filter((g) => g.cycleId === input.copyFromCycleId),
			toGroups: groups,
			students: get().students
		}) : [];
		set({
			cycles: [cycle, ...get().cycles],
			groups: [...get().groups, ...groups],
			students: copied.length ? [...get().students, ...copied] : get().students,
			activeCycleId: cycle.id
		});
		return cycle.id;
	},
	setActiveCycle: (id) => set({ activeCycleId: id }),
	deleteCycle: (id) => {
		const cycles = get().cycles.filter((c) => c.id !== id);
		const groups = get().groups.filter((g) => g.cycleId !== id);
		const remainingStudents = get().students.filter((s) => s.cycleId !== id);
		const removedIds = new Set(get().students.filter((s) => s.cycleId === id).map((s) => s.id));
		const attendance = { ...get().attendance };
		for (const key of Object.keys(attendance)) {
			const studentId = key.split(":")[0];
			if (studentId && removedIds.has(studentId)) delete attendance[key];
		}
		set({
			cycles,
			groups,
			students: remainingStudents,
			attendance,
			activeCycleId: get().activeCycleId === id ? cycles[0]?.id ?? null : get().activeCycleId
		});
	},
	setDay: (cycleId, iso, type, label) => {
		set({ cycles: get().cycles.map((cycle) => {
			if (cycle.id !== cycleId) return cycle;
			const previous = cycle.calendar[iso];
			const next = {
				type,
				label: label ?? previous?.label,
				source: "manual",
				officialType: previous?.officialType ?? previous?.type,
				officialLabel: previous?.officialLabel ?? previous?.label
			};
			return {
				...cycle,
				calendar: {
					...cycle.calendar,
					[iso]: next
				}
			};
		}) });
	},
	restoreDay: (cycleId, iso) => {
		set({ cycles: get().cycles.map((cycle) => {
			if (cycle.id !== cycleId) return cycle;
			const previous = cycle.calendar[iso];
			if (!previous?.officialType) return cycle;
			const next = {
				type: previous.officialType,
				label: previous.officialLabel,
				source: "sep",
				officialType: previous.officialType,
				officialLabel: previous.officialLabel
			};
			return {
				...cycle,
				calendar: {
					...cycle.calendar,
					[iso]: next
				}
			};
		}) });
	},
	addGroup: (cycleId, grade, name) => {
		const meta = GRADE_LABELS[grade];
		const group = {
			id: uid(`g${grade}`),
			cycleId,
			grade,
			name: name?.trim() || meta.name,
			shortName: meta.shortName
		};
		set({ groups: [...get().groups, group] });
		return group.id;
	},
	updateGroup: (id, patch) => {
		set({ groups: get().groups.map((g) => g.id === id ? {
			...g,
			...patch
		} : g) });
	},
	deleteGroup: (id) => {
		const students = get().students.filter((s) => s.groupId !== id);
		const removedIds = new Set(get().students.filter((s) => s.groupId === id).map((s) => s.id));
		const attendance = { ...get().attendance };
		for (const key of Object.keys(attendance)) if (removedIds.has(key.split(":")[0] ?? "")) delete attendance[key];
		set({
			groups: get().groups.filter((g) => g.id !== id),
			students,
			attendance
		});
	},
	addStudent: (input) => {
		const student = {
			...input,
			id: uid("al"),
			givenName: input.givenName.trim(),
			familyName: input.familyName.trim(),
			active: input.active ?? true
		};
		set({ students: [...get().students, student] });
		return student.id;
	},
	addStudentsBulk: (cycleId, groupId, names) => {
		const created = [];
		for (const raw of names) {
			const line = raw.trim();
			if (!line) continue;
			const { givenName, familyName } = parseFullName(line);
			created.push({
				id: uid("al"),
				cycleId,
				groupId,
				givenName,
				familyName,
				active: true
			});
		}
		if (created.length) set({ students: [...get().students, ...created] });
		return created.length;
	},
	updateStudent: (id, patch) => {
		set({ students: get().students.map((s) => s.id === id ? {
			...s,
			...patch
		} : s) });
	},
	removeStudent: (id) => {
		const attendance = { ...get().attendance };
		for (const key of Object.keys(attendance)) if (key.startsWith(`${id}:`)) delete attendance[key];
		set({
			students: get().students.filter((s) => s.id !== id),
			attendance
		});
	},
	setMark: (studentId, date, mark) => {
		const attendance = { ...get().attendance };
		const key = studentKey(studentId, date);
		if (!mark) delete attendance[key];
		else attendance[key] = mark;
		set({ attendance });
	},
	markAllPresent: (studentIds, date) => {
		const attendance = { ...get().attendance };
		for (const id of studentIds) attendance[studentKey(id, date)] = "P";
		set({ attendance });
	},
	assignChip: (studentId, nfcUid) => {
		const clean = nfcUid.trim();
		set({ students: get().students.map((s) => {
			if (s.id === studentId) return {
				...s,
				nfcUid: clean || void 0
			};
			if (clean && s.nfcUid && s.nfcUid.toLowerCase() === clean.toLowerCase()) return {
				...s,
				nfcUid: void 0
			};
			return s;
		}) });
	},
	applyCalendarRows: (cycleId, rows, bounds) => {
		let applied = 0;
		set({ cycles: get().cycles.map((cycle) => {
			if (cycle.id !== cycleId) return cycle;
			const calendar = { ...cycle.calendar };
			for (const row of rows) {
				if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) continue;
				const next = {
					type: row.type,
					label: row.label,
					source: "sep",
					officialType: row.type,
					officialLabel: row.label
				};
				calendar[row.date] = next;
				applied += 1;
			}
			return {
				...cycle,
				calendar,
				startDate: bounds?.startDate || cycle.startDate,
				endDate: bounds?.endDate || cycle.endDate
			};
		}) });
		return applied;
	},
	exportSnapshot: () => JSON.stringify({
		version: 2,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		school: get().school,
		cycles: get().cycles,
		activeCycleId: get().activeCycleId,
		groups: get().groups,
		students: get().students,
		attendance: get().attendance
	}, null, 2),
	importSnapshot: (json) => {
		const data = JSON.parse(json);
		if (!data || !Array.isArray(data.cycles) || !Array.isArray(data.groups)) throw new Error("El archivo no parece un respaldo de Lista JTB.");
		set({
			school: data.school ?? get().school,
			cycles: data.cycles,
			activeCycleId: data.activeCycleId ?? data.cycles[0]?.id ?? null,
			groups: data.groups,
			students: Array.isArray(data.students) ? data.students : [],
			attendance: data.attendance && typeof data.attendance === "object" ? data.attendance : {}
		});
	}
}), {
	name: "jtb-asistencia-v2",
	skipHydration: true,
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	partialize: (state) => ({
		school: state.school,
		cycles: state.cycles,
		activeCycleId: state.activeCycleId,
		groups: state.groups,
		students: state.students,
		attendance: state.attendance
	}),
	onRehydrateStorage: () => (state) => {
		if (!state) {
			useSchoolStore.setState({ hydrated: true });
			return;
		}
		const school = { ...state.school };
		let changed = false;
		if (school.teacher === "Mtra. Carla Vilis Álvarez") {
			school.teacher = "Mtra. Carla Berenice Vilis Álvarez";
			changed = true;
		}
		if (school.cct === "30EJM1426K") {
			school.cct = "30EJN1426K";
			changed = true;
		}
		if (changed) useSchoolStore.setState({ school });
		useSchoolStore.setState({ hydrated: true });
	}
}));
var NAV = [
	{
		to: "/",
		label: "Inicio",
		icon: House
	},
	{
		to: "/ciclos",
		label: "Ciclos Escolares",
		icon: CalendarDays
	},
	{
		to: "/alumnos",
		label: "Alumnos",
		icon: Users
	},
	{
		to: "/asistencia",
		label: "Asistencia",
		icon: ClipboardCheck
	},
	{
		to: "/calendario",
		label: "Calendario",
		icon: CalendarDays
	},
	{
		to: "/reportes",
		label: "Reportes",
		icon: ChartColumn
	},
	{
		to: "/nfc",
		label: "NFC/QR",
		icon: QrCode
	}
];
function HydrateGate({ children }) {
	const hydrated = useSchoolStore((s) => s.hydrated);
	(0, import_react.useEffect)(() => {
		useSchoolStore.persist.rehydrate();
		const t = window.setTimeout(() => {
			if (!useSchoolStore.getState().hydrated) useSchoolStore.setState({ hydrated: true });
		}, 800);
		return () => window.clearTimeout(t);
	}, []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-header px-6 text-center text-primary-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolSeal, { className: "size-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-2xl font-extrabold",
			children: "Jaime Torres Bodet"
		})]
	});
	return children;
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const school = useSchoolStore((s) => s.school);
	const cycle = useSchoolStore((s) => s.cycles.find((c) => c.id === s.activeCycleId));
	const exportSnapshot = useSchoolStore((s) => s.exportSnapshot);
	const [synced, setSynced] = (0, import_react.useState)(true);
	const todayLabel = formatLong(todayISO());
	const todayPretty = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);
	const stateShort = school.state === "Veracruz" ? "Ver." : school.state;
	function backup() {
		downloadFile(`respaldo-jtb-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, exportSnapshot(), "application/json");
		setSynced(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "no-print border-b-2 border-solid border-rule bg-header text-primary-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolSeal, { className: "size-14 shrink-0 ring-2 ring-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xl font-extrabold tracking-tight",
									children: school.name.replace(/^Jardín de Niños\s+/i, "")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-primary-fg/85",
									children: [
										"Jardín de Niños · ",
										school.locality,
										", ",
										stateShort,
										" · Proceso ",
										school.organization
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-primary-fg/75",
									children: [
										school.teacher,
										" · Clave: ",
										school.cct
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden shrink-0 text-right sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: todayPretty
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ciclos",
								className: "rounded-full bg-white/15 px-3 py-1 text-xs font-bold",
								children: ["Ciclo ", cycle?.name ?? "sin ciclo"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-present" }),
									synced ? "Sincronizado" : "Guardando",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
								]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "bg-nav",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-2",
						children: [NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname === item.to;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-12 items-center gap-2 px-3 text-sm font-bold whitespace-nowrap", active ? "bg-white/15 text-white" : "text-white/80"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
							}) }, item.to);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "ml-auto flex items-center pr-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/escuela",
								className: "px-2 text-xs font-bold whitespace-nowrap text-white/70",
								children: "Escuela"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: backup,
								className: "my-1.5 flex h-9 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-bold text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-present" }),
									"Sync"
								]
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-5",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Descargar respaldo",
				className: "no-print fixed right-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-present text-primary-fg shadow-card",
				onClick: backup,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				children: DEFAULT_SCHOOL.name
			})
		]
	});
}
var styles_default = "/assets/styles-BSOX7LGw.css";
var APP_NAME = "Lista JTB";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#1d4fd8"
			},
			{
				name: "description",
				content: "Asistencia del Jardín de Niños Jaime Torres Bodet"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-xyi00bAJ.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./alumnos-BgxIcPAR.mjs");
var Route$6 = createFileRoute("/alumnos")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./asistencia-BN1Squf_.mjs");
var Route$5 = createFileRoute("/asistencia")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./calendario-DKZ700On.mjs");
var Route$4 = createFileRoute("/calendario")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./ciclos-C8o7UzQt.mjs");
var Route$3 = createFileRoute("/ciclos")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./escuela-CR6hVvyi.mjs");
var Route$2 = createFileRoute("/escuela")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./nfc-Cf58TYX4.mjs");
var Route$1 = createFileRoute("/nfc")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./reportes-BQhzVJs4.mjs");
var Route = createFileRoute("/reportes")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AlumnosRoute: Route$6.update({
		id: "/alumnos",
		path: "/alumnos",
		getParentRoute: () => Route$8
	}),
	AsistenciaRoute: Route$5.update({
		id: "/asistencia",
		path: "/asistencia",
		getParentRoute: () => Route$8
	}),
	CalendarioRoute: Route$4.update({
		id: "/calendario",
		path: "/calendario",
		getParentRoute: () => Route$8
	}),
	CiclosRoute: Route$3.update({
		id: "/ciclos",
		path: "/ciclos",
		getParentRoute: () => Route$8
	}),
	EscuelaRoute: Route$2.update({
		id: "/escuela",
		path: "/escuela",
		getParentRoute: () => Route$8
	}),
	NfcRoute: Route$1.update({
		id: "/nfc",
		path: "/nfc",
		getParentRoute: () => Route$8
	}),
	ReportesRoute: Route.update({
		id: "/reportes",
		path: "/reportes",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { weekdayShort as A, clampDate as C, monthsInRange as D, monthBounds as E, parseISO as O, addDays as S, formatShort as T, lectivoDates as _, groupAverage as a, MONTHS_ES_LIST as b, studentStats as c, downloadFile as d, DAY_META as f, isAttendanceDay as g, countLectivos as h, effectiveMark as i, SchoolSeal as j, todayISO as k, cn as l, OFFICIAL_TEMPLATES as m, useSchoolStore as n, isImplicitAbsence as o, MANUAL_DAY_TYPES as p, daySummary as r, markAt as s, router_exports as t, csvEscape as u, markedDays as v, formatLong as w, WEEKDAYS_ES_LIST as x, GRADE_LABELS as y };
