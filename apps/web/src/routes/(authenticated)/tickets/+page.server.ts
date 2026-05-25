import { listTickets } from '@trak/services';
import type { PageServerLoad } from './$types';
import { parsePaginationParams } from '$lib/utils/pagination';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status');
	const isValidStatus = status && validStatuses.includes(status);

	const { page, limit, offset } = parsePaginationParams(url);

	const { tickets, total } = await listTickets({
		status: isValidStatus ? status : undefined,
		limit,
		offset
	});

	return {
		tickets,
		totalCount: total,
		page,
		limit
	};
};
