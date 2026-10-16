import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as lectivoDates, h as countLectivos, k as todayISO, n as useSchoolStore } from "./router-gsbDTyuP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/selectors-iUN_y0c5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useCycleContext() {
	const cycles = useSchoolStore((s) => s.cycles);
	const activeCycleId = useSchoolStore((s) => s.activeCycleId);
	const allGroups = useSchoolStore((s) => s.groups);
	const allStudents = useSchoolStore((s) => s.students);
	return (0, import_react.useMemo)(() => {
		const cycle = cycles.find((c) => c.id === activeCycleId) ?? null;
		const groups = allGroups.filter((g) => g.cycleId === cycle?.id).sort((a, b) => a.grade.localeCompare(b.grade));
		const students = allStudents.filter((s) => s.cycleId === cycle?.id).sort((a, b) => `${a.familyName} ${a.givenName}`.localeCompare(`${b.familyName} ${b.givenName}`, "es"));
		const activeStudents = students.filter((s) => s.active);
		const lectivos = cycle ? countLectivos(cycle.calendar, cycle.startDate, cycle.endDate) : 0;
		const today = todayISO();
		return {
			cycle,
			groups,
			students,
			activeStudents,
			lectivos,
			elapsed: cycle ? lectivoDates(cycle.calendar, cycle.startDate, today <= cycle.endDate ? today : cycle.endDate).length : 0,
			today
		};
	}, [
		cycles,
		activeCycleId,
		allGroups,
		allStudents
	]);
}
//#endregion
export { useCycleContext as t };
