import { getAuditLogs, getAuditLogsCount } from '@trak/services';
import { isAuditAction, isAuditEntityType } from '@trak/shared';
import type { PageServerLoad } from './$types';
import { requireRole } from '$lib/server/helpers';

const PAGE_SIZE = 20;

function parseDateParam(value: string | null): Date | undefined {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

export const load: PageServerLoad = async (event) => {
	requireRole(event, 'admin');

	const rawAction = event.url.searchParams.get('action') || undefined;
	const rawEntityType = event.url.searchParams.get('entityType') || undefined;
	const search = event.url.searchParams.get('search') || undefined;
	const from = parseDateParam(event.url.searchParams.get('from'));
	const to = parseDateParam(event.url.searchParams.get('to'));
	const page = Math.max(1, Number(event.url.searchParams.get('page')) || 1);

	const action = rawAction && isAuditAction(rawAction) ? rawAction : undefined;
	const entityType = rawEntityType && isAuditEntityType(rawEntityType) ? rawEntityType : undefined;

	const filters = { action, entityType, search, from, to };
	const [logs, total] = await Promise.all([
		getAuditLogs({ ...filters, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
		getAuditLogsCount(filters)
	]);

	return {
		logs,
		total,
		page,
		pageSize: PAGE_SIZE,
		pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
		filters: {
			action: action ?? '',
			entityType: entityType ?? '',
			search: search ?? '',
			from: event.url.searchParams.get('from') ?? '',
			to: event.url.searchParams.get('to') ?? ''
		}
	};
};
