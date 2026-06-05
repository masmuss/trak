import { listTickets } from '@trak/services';
import type { PageServerLoad } from './$types';
import { parsePaginationParams } from '$lib/utils/pagination';
import { priorityEnum } from '@trak/database';
import type { Priority } from '@trak/shared';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status');
	const isValidStatus = status && validStatuses.includes(status);

	const priority = url.searchParams.get('priority');
	const isValidPriority = priority && priorityEnum.enumValues.includes(priority as never);

	const slaBreached = url.searchParams.get('sla_breached');
	const isValidSla = slaBreached === 'true' || slaBreached === 'false';

	const { page, limit, offset } = parsePaginationParams(url);

	const { tickets, total } = await listTickets({
		status: isValidStatus ? status : undefined,
		priority: isValidPriority ? (priority as Priority) : undefined,
		slaBreached: isValidSla ? slaBreached : undefined,
		limit,
		offset
	});

	return {
		tickets,
		totalCount: total,
		page,
		limit,
		activeFilter: {
			status: isValidStatus ? status : undefined,
			priority: isValidPriority ? (priority as Priority) : undefined,
			slaBreached: isValidSla ? slaBreached : undefined
		}
	};
};
