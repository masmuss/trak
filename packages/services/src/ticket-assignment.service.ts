import { and, eq, isNull } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { requireActorRole, type Actor } from '@trak/shared';

export async function claimTicket(ticketId: string, actor: Actor): Promise<boolean> {
	requireActorRole(actor, 'agent', 'admin');

	const result = await db
		.update(reports)
		.set({ assignedTo: actor.id, assignedAt: new Date(), assignedBy: actor.id })
		.where(and(eq(reports.id, ticketId), isNull(reports.assignedTo)))
		.returning({ id: reports.id });

	return result.length > 0;
}

export async function assignTicket(
	ticketId: string,
	assigneeId: string | null,
	actor: Actor
): Promise<void> {
	requireActorRole(actor, 'admin');

	await db
		.update(reports)
		.set({
			assignedTo: assigneeId,
			assignedAt: assigneeId ? new Date() : null,
			assignedBy: actor.id
		})
		.where(eq(reports.id, ticketId));
}
