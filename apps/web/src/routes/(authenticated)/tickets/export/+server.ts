import type { RequestHandler } from './$types';
import { getTicketsForExport } from '@trak/services';
import { convertToCSV } from '$lib/utils/csv';
import { parseTicketFilters } from '$lib/server/tickets';
import { requireAuth } from '$lib/server/helpers';

export const GET: RequestHandler = async (event) => {
	const user = requireAuth(event);
	const filters = parseTicketFilters(event.url, { userId: user.id });
	const tickets = await getTicketsForExport(filters);

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
