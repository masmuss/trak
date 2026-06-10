import { listTickets, getTicketStats, getCategories } from '@trak/services';
import type { PageServerLoad } from './$types';
import { parsePaginationParams } from '$lib/utils/pagination';
import { parseTicketFilters } from '$lib/server/tickets';

export const load: PageServerLoad = async ({ url }) => {
	const filters = parseTicketFilters(url);
	const { page, limit, offset } = parsePaginationParams(url);

	const [ticketResult, stats, categories] = await Promise.all([
		listTickets({ ...filters, limit, offset }),
		getTicketStats(),
		getCategories()
	]);

	return {
		tickets: ticketResult.tickets,
		totalCount: ticketResult.total,
		page,
		limit,
		stats,
		categories
	};
};
