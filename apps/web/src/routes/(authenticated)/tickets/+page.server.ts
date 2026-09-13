import { listTickets, getTicketStats, getCategories, getUsers } from '@trak/services';
import type { PageServerLoad } from './$types';
import { parsePaginationParams } from '$lib/utils/pagination';
import { parseTicketFilters } from '$lib/server/tickets';
import { requireAuth } from '$lib/server/helpers';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);
	const filters = parseTicketFilters(event.url, { userId: user.id });
	const { page, limit, offset } = parsePaginationParams(event.url);

	const [ticketResult, stats, categories, users] = await Promise.all([
		listTickets({ ...filters, limit, offset }),
		getTicketStats(),
		getCategories(),
		getUsers()
	]);

	return {
		tickets: ticketResult.tickets,
		totalCount: ticketResult.total,
		page,
		limit,
		stats,
		categories,
		agents: users.filter((candidate) => candidate.isActive && candidate.role === 'agent'),
		currentUser: user
	};
};
