import { eq } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import type { Priority } from '@trak/shared';

const SLA_WINDOWS: Record<Priority, { responseMins: number; resolveMins: number }> = {
	CRITICAL: { responseMins: 15, resolveMins: 120 },
	HIGH: { responseMins: 60, resolveMins: 480 },
	MEDIUM: { responseMins: 240, resolveMins: 1440 },
	LOW: { responseMins: 1440, resolveMins: 10080 }
};

export function calculateSLA(
	priority: Priority,
	from: Date = new Date()
): { responseDue: Date; resolveDue: Date } {
	const window = SLA_WINDOWS[priority];
	return {
		responseDue: new Date(from.getTime() + window.responseMins * 60000),
		resolveDue: new Date(from.getTime() + window.resolveMins * 60000)
	};
}

export async function checkSlaBreach(id: string): Promise<boolean> {
	const ticket = await db.query.reports.findFirst({
		where: eq(reports.id, id)
	});
	if (!ticket) throw new Error('Ticket not found');

	if (ticket.status === 'resolved' || ticket.status === 'closed') return false;

	const now = new Date();
	const breached = !!(
		(ticket.slaResponseDue && ticket.slaResponseDue < now && !ticket.firstRespondedAt) ||
		(ticket.slaResolveDue && ticket.slaResolveDue < now && !ticket.resolvedAt)
	);

	if (breached && !ticket.isSlaBreached) {
		await db.update(reports).set({ isSlaBreached: true }).where(eq(reports.id, id));
	}

	return breached;
}
