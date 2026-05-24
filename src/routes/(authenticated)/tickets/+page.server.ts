import { count, eq } from 'drizzle-orm';
import { reports } from '$lib/server/db/schema';
import type { TicketWithRelations } from '$lib/features/tickets/types';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { parsePaginationParams } from '$lib/utils/pagination';

export const load: PageServerLoad = async ({
	url
}): Promise<{
	tickets: TicketWithRelations[];
	totalCount: number;
	page: number;
	limit: number;
}> => {
	const status = url.searchParams.get('status');
	const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
	const isValidStatus = status && validStatuses.includes(status);

	const { page, limit, offset } = parsePaginationParams(url);

	const whereClause = isValidStatus ? eq(reports.status, status) : undefined;

	const [countResult] = await db
		.select({ count: count(reports.id) })
		.from(reports)
		.where(whereClause);
	const totalCount = countResult?.count ?? 0;

	const tickets = await db.query.reports.findMany({
		where: whereClause,
		limit,
		offset,
		with: {
			reporter: true,
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	});

	return {
		tickets: tickets as TicketWithRelations[],
		totalCount,
		page,
		limit
	};
};
