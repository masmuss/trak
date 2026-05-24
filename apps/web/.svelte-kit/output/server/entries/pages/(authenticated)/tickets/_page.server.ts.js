import { r as reports, t as db } from "../../../../chunks/src.js";
import { count, eq } from "drizzle-orm";
//#region src/lib/utils/pagination.ts
function parsePaginationParams(url) {
	const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
	const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "10"));
	return {
		page,
		limit,
		offset: (page - 1) * limit
	};
}
//#endregion
//#region src/routes/(authenticated)/tickets/+page.server.ts
var load = async ({ url }) => {
	const status = url.searchParams.get("status");
	const isValidStatus = status && [
		"open",
		"in_progress",
		"resolved",
		"closed"
	].includes(status);
	const { page, limit, offset } = parsePaginationParams(url);
	const whereClause = isValidStatus ? eq(reports.status, status) : void 0;
	const [countResult] = await db.select({ count: count(reports.id) }).from(reports).where(whereClause);
	const totalCount = countResult?.count ?? 0;
	return {
		tickets: await db.query.reports.findMany({
			where: whereClause,
			limit,
			offset,
			with: {
				reporter: true,
				category: true
			},
			orderBy: (reports, { desc }) => [desc(reports.createdAt)]
		}),
		totalCount,
		page,
		limit
	};
};
//#endregion
export { load };
