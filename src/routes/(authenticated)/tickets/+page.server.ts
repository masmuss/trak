import type { TicketWithRelations } from '$lib/features/tickets/types';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<{ tickets: TicketWithRelations[] }> => {
	const tickets = await db.query.reports.findMany({
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
