import { n as reports, t as db } from "../../../../../chunks/src.js";
import { eq } from "drizzle-orm";
//#region src/lib/utils/csv.ts
/**
* Utility to convert an array of objects into a properly escaped CSV string.
*/
function convertToCSV(data, headers, mapper) {
	const escapeField = (field) => {
		if (field === null || field === void 0) return "";
		const stringified = String(field);
		if (stringified.includes("\"") || stringified.includes(",") || stringified.includes("\n") || stringified.includes("\r")) return `"${stringified.replace(/"/g, "\"\"")}"`;
		return stringified;
	};
	return [headers.map(escapeField).join(","), ...data.map((item) => mapper(item).map(escapeField).join(","))].join("\r\n");
}
//#endregion
//#region src/routes/(authenticated)/tickets/export/+server.ts
var GET = async ({ url }) => {
	const status = url.searchParams.get("status");
	const whereClause = status && [
		"open",
		"in_progress",
		"resolved",
		"closed"
	].includes(status) ? eq(reports.status, status) : void 0;
	const csvContent = convertToCSV(await db.query.reports.findMany({
		where: whereClause,
		with: {
			reporter: true,
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	}), [
		"ID",
		"Title",
		"Body",
		"Status",
		"Category",
		"Reporter Name",
		"Telegram Username",
		"Telegram ID",
		"Created At"
	], (t) => [
		t.id,
		t.title,
		t.body,
		t.status,
		t.category?.name ?? "Uncategorized",
		t.reporter?.fullName ?? "",
		t.reporter?.username ?? "",
		t.reporter?.telegramId ? String(t.reporter.telegramId) : "",
		t.createdAt.toISOString()
	]);
	return new Response(csvContent, { headers: {
		"Content-Type": "text/csv",
		"Content-Disposition": "attachment; filename=\"tickets-export.csv\""
	} });
};
//#endregion
export { GET };
