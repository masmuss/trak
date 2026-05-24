import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { reports } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { convertToCSV } from '$lib/utils/csv';

export const GET: RequestHandler = async ({ url }) => {
	const status = url.searchParams.get('status');
	const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
	const isValidStatus = status && validStatuses.includes(status);

	const whereClause = isValidStatus ? eq(reports.status, status) : undefined;

	const tickets = await db.query.reports.findMany({
		where: whereClause,
		with: {
			reporter: true,
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
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
