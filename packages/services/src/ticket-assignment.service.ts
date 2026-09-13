import { and, count, eq, inArray, isNull } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { ForbiddenError, isUserRole, requireActorRole, type Actor } from '@trak/shared';
import { createAuditLog } from './audit.service';
import { createAgentNotification } from './notification.service';
import { getUserById } from './user.service';

export async function claimTicket(ticketId: string, actor: Actor): Promise<boolean> {
	requireActorRole(actor, 'agent', 'admin');

	return db.transaction(async (tx) => {
		const result = await tx
			.update(reports)
			.set({ assignedTo: actor.id, assignedAt: new Date(), assignedBy: actor.id })
			.where(and(eq(reports.id, ticketId), isNull(reports.assignedTo)))
			.returning({ id: reports.id });

		if (result.length === 0) return false;

		await createAuditLog(
			{
				actorUserId: actor.id,
				action: 'ticket.assigned',
				entityType: 'ticket',
				entityId: ticketId,
				afterData: { assignedTo: actor.id, method: 'claim' }
			},
			tx
		);

		return true;
	});
}

async function requireActiveAssignee(assigneeId: string) {
	const assignee = await getUserById(assigneeId);
	if (!assignee) throw new Error('Assignee not found');
	if (!assignee.isActive) throw new Error('Assignee is not active');
	if (!isUserRole(assignee.role)) {
		throw new ForbiddenError('Assignee must be an agent or admin');
	}
	return assignee;
}

export async function assignTicket(
	ticketId: string,
	assigneeId: string | null,
	actor: Actor
): Promise<void> {
	requireActorRole(actor, 'admin');

	if (assigneeId) await requireActiveAssignee(assigneeId);

	const { previousAssigneeId, ticketCode } = await db.transaction(async (tx) => {
		const existing = await tx.query.reports.findFirst({
			where: eq(reports.id, ticketId),
			columns: { assignedTo: true, ticketCode: true }
		});
		if (!existing) throw new Error('Ticket not found');

		await tx
			.update(reports)
			.set({
				assignedTo: assigneeId,
				assignedAt: assigneeId ? new Date() : null,
				assignedBy: actor.id
			})
			.where(eq(reports.id, ticketId));

		await createAuditLog(
			{
				actorUserId: actor.id,
				action: 'ticket.assigned',
				entityType: 'ticket',
				entityId: ticketId,
				beforeData: { assignedTo: existing.assignedTo },
				afterData: { assignedTo: assigneeId, method: 'manual' }
			},
			tx
		);

		return { previousAssigneeId: existing.assignedTo, ticketCode: existing.ticketCode };
	});

	if (previousAssigneeId && previousAssigneeId !== assigneeId) {
		await createAgentNotification({
			recipientUserId: previousAssigneeId,
			reportId: ticketId,
			type: 'assignment',
			message: assigneeId
				? `Ticket ${ticketCode} dipindahkan dari Anda ke agent lain`
				: `Assignment ticket ${ticketCode} untuk Anda telah dihapus`
		});
	}

	if (assigneeId && assigneeId !== previousAssigneeId) {
		await createAgentNotification({
			recipientUserId: assigneeId,
			reportId: ticketId,
			type: 'assignment',
			message: `Ticket ${ticketCode} ditugaskan kepada Anda`
		});
	}
}

export type AgentWorkload = {
	userId: string;
	activeTickets: number;
};

export async function getActiveTicketCounts(): Promise<AgentWorkload[]> {
	const rows = await db
		.select({ userId: reports.assignedTo, activeTickets: count(reports.id) })
		.from(reports)
		.where(inArray(reports.status, ['open', 'in_progress']))
		.groupBy(reports.assignedTo);

	return rows
		.filter((row): row is { userId: string; activeTickets: number } => row.userId !== null)
		.map((row) => ({ userId: row.userId, activeTickets: Number(row.activeTickets) }));
}
