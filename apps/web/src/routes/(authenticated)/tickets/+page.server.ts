import { listTickets, getTicketStats } from '@trak/services';
import type { PageServerLoad } from './$types';
import { parsePaginationParams } from '$lib/utils/pagination';
import { parseTicketFilters } from '$lib/server/tickets';

export const load: PageServerLoad = async ({ url }) => {
	const filters = parseTicketFilters(url);
	const { page, limit, offset } = parsePaginationParams(url);

	const [ticketResult, stats] = await Promise.all([
		listTickets({ ...filters, limit, offset }),
		getTicketStats()
	]);

	return {
		tickets: ticketResult.tickets,
		totalCount: ticketResult.total,
		page,
		limit,
		activeFilter: filters,
		stats
	};
};
