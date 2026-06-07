import { priorityEnum } from '@trak/database';
import type { Priority } from '@trak/shared';
import type { RequestEvent } from '@sveltejs/kit';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const;

export function parseTicketFilters(url: RequestEvent['url']) {
	const status = url.searchParams.get('status');
	const isValidStatus = status && validStatuses.includes(status as never);

	const priority = url.searchParams.get('priority');
	const isValidPriority = priority && priorityEnum.enumValues.includes(priority as never);

	const slaBreached = url.searchParams.get('sla_breached');
	const isValidSla = slaBreached === 'true' || slaBreached === 'false';

	return {
		status: isValidStatus ? status : undefined,
		priority: isValidPriority ? (priority as Priority) : undefined,
		slaBreached: isValidSla ? slaBreached : undefined
	};
}
