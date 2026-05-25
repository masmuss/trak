import type { RequestHandler } from './$types';
import { getTicketsForExport } from '@trak/services';
import { convertToCSV } from '$lib/utils/csv';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

export const GET: RequestHandler = async ({ url }) => {
	const status = url.searchParams.get('status');
	const isValidStatus = status && validStatuses.includes(status);

	const tickets = await getTicketsForExport(isValidStatus ? status : undefined);

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
