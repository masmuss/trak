import { getAuditLogs } from '@trak/services';
import { isAuditAction, isAuditEntityType } from '@trak/shared';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireRole } from '$lib/server/helpers';

function csvCell(value: unknown): string {
	const text = value === null || value === undefined ? '' : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

function parseDateParam(value: string | null): Date | undefined {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

export const GET: RequestHandler = async (event) => {
	requireRole(event, 'admin');

	const rawAction = event.url.searchParams.get('action') || undefined;
	const rawEntityType = event.url.searchParams.get('entityType') || undefined;
	const action = rawAction && isAuditAction(rawAction) ? rawAction : undefined;
	const entityType = rawEntityType && isAuditEntityType(rawEntityType) ? rawEntityType : undefined;
	const search = event.url.searchParams.get('search') || undefined;
	const from = parseDateParam(event.url.searchParams.get('from'));
	const to = parseDateParam(event.url.searchParams.get('to'));
	if ((event.url.searchParams.get('from') && !from) || (event.url.searchParams.get('to') && !to)) {
		throw error(400, 'Invalid date filter');
	}

	const logs = await getAuditLogs({ action, entityType, search, from, to, limit: 5000 });

	const header = ['time', 'actor', 'action', 'entity_type', 'entity_id', 'before', 'after'];
	const rows = logs.map((log) =>
		[
			log.createdAt.toISOString(),
			log.actor?.email ?? 'system',
			log.action,
			log.entityType,
			log.entityId,
			JSON.stringify(log.beforeData ?? null),
			JSON.stringify(log.afterData ?? null)
		]
			.map(csvCell)
			.join(',')
	);

	return new Response([header.join(','), ...rows].join('\n'), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="audit-logs.csv"'
		}
	});
};
