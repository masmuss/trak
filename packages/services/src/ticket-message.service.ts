import { eq } from 'drizzle-orm';
import {
	db,
	reports,
	reportAttachments,
	statusHistories,
	ticketMessages,
	type DatabaseTransaction
} from '@trak/database';
import type { CreateMessageAttachmentInput, CreateTicketMessageInput } from './report.types';
import { calculateSLA } from './ticket-sla.service';
import { createAgentNotification, publishAgentNotification } from './notification.service';
import { createAuditLog } from './audit.service';

async function requireTicket(tx: DatabaseTransaction, id: string) {
	const existing = await tx.query.reports.findFirst({
		where: eq(reports.id, id)
	});
	if (!existing) throw new Error('Ticket not found');
	return existing;
}

export async function createTicketMessage(input: CreateTicketMessageInput) {
	const body = input.body.trim();
	if (!body) throw new Error('Message body is required');

	return db.transaction(async (tx) => {
		const ticket = await requireTicket(tx, input.reportId);
		const [message] = await tx
			.insert(ticketMessages)
			.values({
				reportId: input.reportId,
				senderType: input.senderType,
				senderUserId: input.senderUserId,
				senderReporterId: input.senderReporterId,
				body,
				isInternal: input.isInternal ?? false
			})
			.returning();

		if (input.senderType === 'agent' && !input.isInternal && !ticket.firstRespondedAt) {
			await tx
				.update(reports)
				.set({ firstRespondedAt: message.createdAt })
				.where(eq(reports.id, input.reportId));
		}

		if (input.attachments?.length) {
			await tx.insert(reportAttachments).values(
				input.attachments.map((attachment: CreateMessageAttachmentInput) => ({
					reportId: input.reportId,
					messageId: message.id,
					fileId: attachment.fileId,
					fileType: attachment.fileType,
					storageUrl: attachment.storageUrl
				}))
			);
		}

		await createAuditLog(
			{
				actorUserId: input.senderUserId ?? null,
				action: 'ticket.message_created',
				entityType: 'ticket_message',
				entityId: message.id,
				afterData: {
					reportId: input.reportId,
					senderType: input.senderType,
					visibility: input.isInternal ? 'internal' : 'public',
					attachmentCount: input.attachments?.length ?? 0
				}
			},
			tx
		);

		return message;
	});
}

export async function createReporterTicketMessage(
	input: Pick<CreateTicketMessageInput, 'reportId' | 'body' | 'senderReporterId' | 'attachments'>
) {
	const body = input.body.trim();
	if (!input.senderReporterId) throw new Error('Reporter is required');
	if (!body) throw new Error('Message body is required');

	const { message, assigneeId, ticketCode } = await db.transaction(async (tx) => {
		const ticket = await requireTicket(tx, input.reportId);
		if (ticket.reporterId !== input.senderReporterId) {
			throw new Error('Reporter does not own this ticket');
		}
		if (ticket.status === 'closed') {
			throw new Error('Closed tickets cannot receive messages');
		}

		const reopened = ticket.status === 'resolved';
		if (reopened) {
			const { responseDue, resolveDue } = calculateSLA(ticket.priority);
			await tx
				.update(reports)
				.set({
					status: 'open',
					resolvedAt: null,
					slaResponseDue: responseDue,
					slaResolveDue: resolveDue,
					isSlaBreached: false
				})
				.where(eq(reports.id, input.reportId));

			await tx.insert(statusHistories).values({
				reportId: input.reportId,
				changedBy: null,
				oldStatus: 'resolved',
				newStatus: 'open',
				note: 'Ticket reopened because the reporter replied'
			});
		}

		const [message] = await tx
			.insert(ticketMessages)
			.values({
				reportId: input.reportId,
				senderType: 'reporter',
				senderReporterId: input.senderReporterId,
				body,
				isInternal: false
			})
			.returning();

		if (input.attachments?.length) {
			await tx.insert(reportAttachments).values(
				input.attachments.map((attachment: CreateMessageAttachmentInput) => ({
					reportId: input.reportId,
					messageId: message.id,
					fileId: attachment.fileId,
					fileType: attachment.fileType,
					storageUrl: attachment.storageUrl
				}))
			);
		}

		await createAuditLog(
			{
				action: 'ticket.message_created',
				entityType: 'ticket_message',
				entityId: message.id,
				afterData: {
					reportId: input.reportId,
					senderType: 'reporter',
					attachmentCount: input.attachments?.length ?? 0
				}
			},
			tx
		);

		if (reopened) {
			await createAuditLog(
				{
					action: 'ticket.reopened',
					entityType: 'ticket',
					entityId: input.reportId,
					beforeData: { status: 'resolved' },
					afterData: { status: 'open', reason: 'reporter_reply' }
				},
				tx
			);
		}

		return {
			message,
			assigneeId: ticket.assignedTo,
			reopened,
			ticketCode: ticket.ticketCode
		};
	});

	if (assigneeId) {
		await createAgentNotification({
			recipientUserId: assigneeId,
			reportId: input.reportId,
			messageId: message.id,
			type: 'reporter_reply',
			message: `Reporter replied to ticket ${ticketCode}`
		});
	}

	try {
		await publishAgentNotification({
			reportId: input.reportId,
			messageId: message.id,
			message: body
		});
	} catch (error) {
		console.error(`Failed to publish agent notification for message ${message.id}:`, error);
	}

	return message;
}
