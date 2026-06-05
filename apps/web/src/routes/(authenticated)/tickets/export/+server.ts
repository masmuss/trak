import type { RequestHandler } from './$types';
import { getTicketsForExport } from '@trak/services';
import { convertToCSV } from '$lib/utils/csv';
import { priorityEnum } from '@trak/database';
import type { Priority } from '@trak/shared';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

export const GET: RequestHandler = async ({ url }) => {
	const status = url.searchParams.get('status');
	const isValidStatus = status && validStatuses.includes(status);

	const priority = url.searchParams.get('priority');
	const isValidPriority = priority && priorityEnum.enumValues.includes(priority as never);

	const slaBreached = url.searchParams.get('sla_breached');
	const isValidSla = slaBreached === 'true' || slaBreached === 'false';

	const tickets = await getTicketsForExport({
		status: isValidStatus ? status : undefined,
		priority: isValidPriority ? (priority as Priority) : undefined,
		slaBreached: isValidSla ? slaBreached : undefined
	});

	const headers = [
		'ID',
		'Title',
		'Body',
		'Status',
		'Category',
		'Reporter Name',
		'Telegram Username',
		'Telegram ID',
		'Created At'
	];

	const csvContent = convertToCSV(tickets, headers, (t) => [
		t.id,
		t.title,
		t.body,
		t.status,
		t.category?.name ?? 'Uncategorized',
		t.reporter?.fullName ?? '',
		t.reporter?.username ?? '',
		t.reporter?.telegramId ? String(t.reporter.telegramId) : '',
		t.createdAt.toISOString()
	]);

	return new Response(csvContent, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': 'attachment; filename="tickets-export.csv"'
		}
	});
};
