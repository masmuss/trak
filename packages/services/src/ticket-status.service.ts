import { eq } from 'drizzle-orm';
import { db, reports, statusHistories } from '@trak/database';
import type { Priority } from '@trak/shared';
import { calculateSLA } from './ticket-sla.service';

async function requireTicket(tx: any, id: string) {
	const existing = await tx.query.reports.findFirst({ where: eq(reports.id, id) });
	if (!existing) throw new Error('Ticket not found');
	return existing;
}

export async function updateTicketStatus(
	id: string,
	newStatus: string,
	changedByUserId: string,
	note?: string
): Promise<void> {
	await db.transaction(async (tx) => {
		const existing = await requireTicket(tx, id);
		const now = new Date();
		const timestamps = {
			firstRespondedAt:
				newStatus !== 'open' && !existing.firstRespondedAt ? now : existing.firstRespondedAt,
			resolvedAt:
				(newStatus === 'resolved' || newStatus === 'closed') && !existing.resolvedAt
					? now
					: existing.resolvedAt
		};

		await tx
			.update(reports)
			.set({ status: newStatus, ...timestamps })
			.where(eq(reports.id, id));
		await tx.insert(statusHistories).values({
			reportId: id,
			changedBy: changedByUserId,
			oldStatus: existing.status,
			newStatus,
			note: note || null
		});
	});
}

export async function updateTicketPriority(
	id: string,
	priority: Priority,
	changedByUserId: string
): Promise<void> {
	await db.transaction(async (tx) => {
		const existing = await requireTicket(tx, id);
		const { responseDue, resolveDue } = calculateSLA(priority, existing.createdAt);

		await tx
			.update(reports)
			.set({
				priority,
				slaResponseDue: responseDue,
				slaResolveDue: resolveDue,
				isSlaBreached: false
			})
			.where(eq(reports.id, id));
		await tx.insert(statusHistories).values({
			reportId: id,
			changedBy: changedByUserId,
			oldStatus: existing.status,
			newStatus: existing.status,
			note: `Priority changed from ${existing.priority} to ${priority}`
		});
	});
}
