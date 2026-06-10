import { priorityEnum } from '@trak/database';

const validStatusValues = new Set(['open', 'in_progress', 'resolved', 'closed']);
const validPriorityValues = new Set(priorityEnum.enumValues);

export function parseTicketFilters(url: URL) {
	const rawStatus = url.searchParams.get('status');
	const status = rawStatus
		? rawStatus
				.split(',')
				.filter((v) => validStatusValues.has(v))
				.join(',')
		: undefined;

	const rawPriority = url.searchParams.get('priority');
	const priority = rawPriority
		? rawPriority
				.split(',')
				.filter((v) => validPriorityValues.has(v as never))
				.join(',')
		: undefined;

	const slaBreached = url.searchParams.get('sla_breached');
	const isValidSla = slaBreached === 'true' || slaBreached === 'false';

	const categoryId = url.searchParams.get('categoryId');

	const search = url.searchParams.get('search');

	return {
		status: status || undefined,
		priority: priority || undefined,
		slaBreached: isValidSla ? slaBreached : undefined,
		categoryId: categoryId || undefined,
		search: search || undefined
	};
}
