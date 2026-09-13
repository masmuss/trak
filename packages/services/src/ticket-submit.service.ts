import { randomBytes } from 'node:crypto';
import { db, reportAttachments, reports } from '@trak/database';
import { MAX_REPORT_BODY_LENGTH, MAX_REPORT_TITLE_LENGTH } from '@trak/shared';
import type { CreateMessageAttachmentInput, CreateReportInput } from './report.types';
import { calculateSLA } from './ticket-sla.service';
import { createAuditLog } from './audit.service';

export type SubmitReportInput = CreateReportInput & {
	attachments: CreateMessageAttachmentInput[];
};

function generateTicketCode(): string {
	const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
	const randomStr = randomBytes(2).toString('hex').toUpperCase();
	return `TKT-${dateStr}-${randomStr}`;
}

function validateReportInput(input: CreateReportInput): { title: string; body: string } {
	const title = input.title.trim();
	const body = input.body.trim();
	if (!input.reporterId) throw new Error('Reporter is required');
	if (!title) throw new Error('Report title is required');
	if (!body) throw new Error('Report body is required');
	if (title.length > MAX_REPORT_TITLE_LENGTH) {
		throw new Error(`Report title must not exceed ${MAX_REPORT_TITLE_LENGTH} characters`);
	}
	if (body.length > MAX_REPORT_BODY_LENGTH) {
		throw new Error(`Report body must not exceed ${MAX_REPORT_BODY_LENGTH} characters`);
	}
	return { title, body };
}

/**
 * Single-transaction report submission: ticket + attachments + audit.
 * Conversations and callbacks call this facade instead of orchestrating
 * createReport + addReportAttachment loops themselves.
 */
export async function submitReportWithAttachments(
	input: SubmitReportInput
): Promise<{ id: string; ticketCode: string }> {
	const { title, body } = validateReportInput(input);
	const ticketCode = generateTicketCode();
	const { responseDue, resolveDue } = calculateSLA('MEDIUM');

	const { id } = await db.transaction(async (tx) => {
		const [report] = await tx
			.insert(reports)
			.values({
				ticketCode,
				reporterId: input.reporterId,
				categoryId: input.categoryId ?? null,
				title,
				body,
				status: 'open',
				priority: 'MEDIUM',
				slaResponseDue: responseDue,
				slaResolveDue: resolveDue
			})
			.returning({ id: reports.id });

		if (input.attachments.length > 0) {
			await tx.insert(reportAttachments).values(
				input.attachments.map((attachment) => ({
					reportId: report.id,
					fileId: attachment.fileId,
					fileType: attachment.fileType,
					storageUrl: attachment.storageUrl
				}))
			);
		}

		await createAuditLog(
			{
				action: 'ticket.created',
				entityType: 'ticket',
				entityId: report.id,
				afterData: {
					ticketCode,
					categoryId: input.categoryId ?? null,
					attachmentCount: input.attachments.length
				}
			},
			tx
		);

		return { id: report.id };
	});

	return { id, ticketCode };
}
