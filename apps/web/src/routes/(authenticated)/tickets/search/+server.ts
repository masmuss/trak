import { json } from '@sveltejs/kit';
import { listTickets } from '@trak/services';
import { requireAuth } from '$lib/server/helpers';
import type { RequestHandler } from './$types';

const SEARCH_LIMIT = 8;
const MIN_QUERY_LENGTH = 2;

export const GET: RequestHandler = async (event) => {
	requireAuth(event);

	const query = event.url.searchParams.get('q')?.trim() ?? '';
	if (query.length < MIN_QUERY_LENGTH) return json([]);

	const result = await listTickets({ search: query, limit: SEARCH_LIMIT, offset: 0 });
	return json(
		result.tickets.map((ticket) => ({
			id: ticket.id,
			ticketCode: ticket.ticketCode,
			title: ticket.title,
			status: ticket.status,
			priority: ticket.priority
		}))
	);
};
