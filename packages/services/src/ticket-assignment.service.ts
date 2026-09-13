import { and, eq, isNull } from 'drizzle-orm';
import { db, reports } from '@trak/database';

export async function claimTicket(ticketId: string, userId: string): Promise<boolean> {
	const result = await db
		.update(reports)
		.set({ assignedTo: userId, assignedAt: new Date(), assignedBy: userId })
		.where(and(eq(reports.id, ticketId), isNull(reports.assignedTo)))
		.returning({ id: reports.id });

	return result.length > 0;
}

export async function assignTicket(
	ticketId: string,
	assigneeId: string | null,
	assignedBy: string
): Promise<void> {
	await db
		.update(reports)
		.set({
			assignedTo: assigneeId,
			assignedAt: assigneeId ? new Date() : null,
			assignedBy
		})
		.where(eq(reports.id, ticketId));
}
