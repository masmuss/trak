import { isPriority, isTicketStatus } from '@trak/shared';
import { isTicketSortKey } from '@trak/services';

export function parseTicketFilters(url: URL, context?: { userId?: string }) {
	const rawStatus = url.searchParams.get('status');
	const status = rawStatus ? rawStatus.split(',').filter(isTicketStatus).join(',') : undefined;

	const rawPriority = url.searchParams.get('priority');
	const priority = rawPriority ? rawPriority.split(',').filter(isPriority).join(',') : undefined;

	const slaBreached = url.searchParams.get('sla_breached');
	const isValidSla = slaBreached === 'true' || slaBreached === 'false';

	const categoryId = url.searchParams.get('categoryId');
	const rawAssignedTo = url.searchParams.get('assignedTo');
	const assignedTo = rawAssignedTo === 'my' && context?.userId ? context.userId : rawAssignedTo;

	const search = url.searchParams.get('search');

	const rawSort = url.searchParams.get('sort');
	const sort = rawSort && isTicketSortKey(rawSort) ? rawSort : undefined;
	const rawOrder = url.searchParams.get('order');
	const order = rawOrder === 'asc' || rawOrder === 'desc' ? rawOrder : undefined;

	return {
		status: status || undefined,
		priority: priority || undefined,
		slaBreached: isValidSla ? slaBreached : undefined,
		categoryId: categoryId || undefined,
		assignedTo: assignedTo || undefined,
		search: search || undefined,
		sort: sort || undefined,
		order: order || undefined
	};
}
