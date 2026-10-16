import { E as monthBounds, _ as lectivoDates, b as MONTHS_ES_LIST, c as studentStats, s as markAt, u as csvEscape } from "./router-gsbDTyuP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-XlbY8Nsq.js
function monthlyAttendanceCsv(opts) {
	const { start, end } = monthBounds(opts.year, opts.month);
	const days = lectivoDates(opts.calendar, start, end);
	const header = [
		"No.",
		"Apellidos",
		"Nombre",
		"Grado",
		...days.map((iso) => iso.slice(8)),
		"P",
		"A",
		"J",
		"R",
		"%"
	];
	const rows = opts.students.map((student, i) => {
		const group = opts.groups.find((g) => g.id === student.groupId);
		const stats = studentStats(student, opts.calendar, opts.attendance, start, end);
		const marks = days.map((iso) => markAt(opts.attendance, student.id, iso) ?? "");
		return [
			i + 1,
			student.familyName,
			student.givenName,
			group?.shortName ?? "",
			...marks,
			stats.present + stats.late,
			stats.absent,
			stats.justified,
			stats.late,
			stats.percent
		].map(csvEscape);
	});
	return `\uFEFF${[
		csvEscape(opts.school.name),
		csvEscape(`CCT ${opts.school.cct}`),
		csvEscape(`Ciclo ${opts.cycleName}`),
		csvEscape(`${MONTHS_ES_LIST[opts.month]} ${opts.year}`)
	].join(",")}\n${header.map(csvEscape).join(",")}\n${rows.map((r) => r.join(",")).join("\n")}\n`;
}
function reportsCsv(opts) {
	const header = [
		"No.",
		"Apellidos",
		"Nombre",
		"Grado",
		"P",
		"A",
		"J",
		"R",
		"Sin marca",
		"Días lectivos",
		"%"
	];
	const rows = opts.students.map((student, i) => {
		const group = opts.groups.find((g) => g.id === student.groupId);
		const stats = studentStats(student, opts.calendar, opts.attendance, opts.from, opts.to);
		return [
			i + 1,
			student.familyName,
			student.givenName,
			group?.shortName ?? "",
			stats.present + stats.late,
			stats.absent,
			stats.justified,
			stats.late,
			stats.blank,
			stats.lectivos,
			stats.percent
		].map(csvEscape);
	});
	return `\uFEFF${[
		opts.school.name,
		`CCT ${opts.school.cct}`,
		`Ciclo ${opts.cycleName}`,
		opts.rangeLabel
	].map(csvEscape).join(",")}\n${header.map(csvEscape).join(",")}\n${rows.map((r) => r.join(",")).join("\n")}\n`;
}
//#endregion
export { reportsCsv as n, monthlyAttendanceCsv as t };
