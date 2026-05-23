import type { TicketWithRelations } from '$lib/features/tickets/types';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url
}): Promise<{ tickets: TicketWithRelations[] }> => {
	const status = url.searchParams.get('status');
	const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
	const isValidStatus = status && validStatuses.includes(status);

	const tickets = await db.query.reports.findMany({
		where: isValidStatus ? (reports, { eq }) => eq(reports.status, status) : undefined,
		with: {
			reporter: true,
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	});

	return {
		tickets: tickets as TicketWithRelations[]
	};
};
