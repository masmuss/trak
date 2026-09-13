import { randomBytes } from 'node:crypto';
import { db, reports } from '@trak/database';
import type { CreateReportInput } from './report.types';
import { calculateSLA } from './ticket-sla.service';

function generateTicketCode(): string {
	const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
	const randomStr = randomBytes(2).toString('hex').toUpperCase();
	return `TKT-${dateStr}-${randomStr}`;
}

export async function createReport(
	input: CreateReportInput
): Promise<{ id: string; ticketCode: string }> {
	const ticketCode = generateTicketCode();
	const { responseDue, resolveDue } = calculateSLA('MEDIUM');

	const result = await db
		.insert(reports)
		.values({
			ticketCode,
			reporterId: input.reporterId,
			categoryId: input.categoryId ?? null,
			title: input.title.trim(),
			body: input.body.trim(),
			status: 'open',
			priority: 'MEDIUM',
			slaResponseDue: responseDue,
			slaResolveDue: resolveDue
		})
		.returning({ id: reports.id, ticketCode: reports.ticketCode });

	return result[0];
}
