import { isPriority, isTicketStatus } from '@trak/shared';

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

	return {
		status: status || undefined,
		priority: priority || undefined,
		slaBreached: isValidSla ? slaBreached : undefined,
		categoryId: categoryId || undefined,
		assignedTo: assignedTo || undefined,
		search: search || undefined
	};
}
