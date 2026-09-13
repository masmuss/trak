import { eq } from 'drizzle-orm';
import { db, reports, statusHistories, type DatabaseTransaction } from '@trak/database';
import { requireActorRole, type Actor, type Priority, type TicketStatus } from '@trak/shared';
import { calculateSLA } from './ticket-sla.service';
import { createAuditLog } from './audit.service';

async function requireTicket(tx: DatabaseTransaction, id: string) {
	const existing = await tx.query.reports.findFirst({ where: eq(reports.id, id) });
	if (!existing) throw new Error('Ticket not found');
	return existing;
}

export async function updateTicketStatus(
	id: string,
	newStatus: TicketStatus,
	actor: Actor,
	note?: string
): Promise<void> {
	requireActorRole(actor, 'agent', 'admin');

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
			changedBy: actor.id,
			oldStatus: existing.status,
			newStatus,
			note: note || null
		});
		await createAuditLog(
			{
				actorUserId: actor.id,
				action: 'ticket.status_changed',
				entityType: 'ticket',
				entityId: id,
				beforeData: { status: existing.status },
				afterData: { status: newStatus, note: note || null }
			},
			tx
		);
	});
}

export async function updateTicketPriority(
	id: string,
	priority: Priority,
	actor: Actor
): Promise<void> {
	requireActorRole(actor, 'admin');

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
			changedBy: actor.id,
			oldStatus: existing.status,
			newStatus: existing.status,
			note: `Priority changed from ${existing.priority} to ${priority}`
		});
		await createAuditLog(
			{
				actorUserId: actor.id,
				action: 'ticket.priority_changed',
				entityType: 'ticket',
				entityId: id,
				beforeData: { priority: existing.priority },
				afterData: { priority }
			},
			tx
		);
	});
}
