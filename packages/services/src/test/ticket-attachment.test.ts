import { describe, expect, it } from 'vitest';
import { addReportAttachment, getReportAttachmentById } from '../ticket-attachment.service';
import { createTicketMessage, createReporterTicketMessage } from '../ticket-message.service';
import { getTicketById } from '../ticket-query.service';
import { getAuditLogs } from '../audit.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

describe('report attachments', () => {
	it('links a report-level attachment and audits it', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await addReportAttachment({
			reportId: ticket.id,
			fileId: 'file-report-1',
			fileType: 'image/jpeg',
			storageUrl: 'telegram://file-report-1'
		});

		const withAttachments = await getTicketById(ticket.id);
		expect(withAttachments?.attachments).toHaveLength(1);
		expect(withAttachments?.attachments[0]?.messageId).toBeNull();
		expect(withAttachments?.attachments[0]?.fileType).toBe('image/jpeg');

		const logs = await getAuditLogs({ action: 'ticket.attachment_added' });
		expect(logs.some((log) => log.entityType === 'attachment')).toBe(true);
	});

	it('resolves an attachment with its report and message relations', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await addReportAttachment({
			reportId: ticket.id,
			fileId: 'file-rel-1',
			fileType: 'application/pdf',
			storageUrl: 'telegram://file-rel-1'
		});

		const withAttachments = await getTicketById(ticket.id);
		const attachmentId = withAttachments?.attachments[0]?.id;
		expect(attachmentId).toBeDefined();

		const attachment = await getReportAttachmentById(attachmentId as string);
		expect(attachment?.report.id).toBe(ticket.id);
		expect(attachment?.message).toBeNull();
	});

	it('links message attachments to the message, not just the report', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const message = await createTicketMessage({
			reportId: ticket.id,
			senderType: 'agent',
			senderUserId: agent.id,
			body: 'Berikut file panduannya',
			attachments: [
				{ fileId: 'file-msg-1', fileType: 'application/pdf', storageUrl: 's3://file-msg-1' }
			]
		});

		const detailed = await getTicketById(ticket.id);
		const stored = detailed?.attachments.find((a) => a.fileId === 'file-msg-1');
		expect(stored?.messageId).toBe(message.id);

		const messageWithAttachments = detailed?.messages.find((m) => m.id === message.id);
		expect(messageWithAttachments?.attachments).toHaveLength(1);
	});

	it('keeps reporter reply attachments scoped to the owned ticket', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const message = await createReporterTicketMessage({
			reportId: ticket.id,
			senderReporterId: reporter.id,
			body: 'Lampiran bukti tambahan',
			attachments: [
				{ fileId: 'file-reply-1', fileType: 'image/png', storageUrl: 'telegram://file-reply-1' }
			]
		});

		const detailed = await getTicketById(ticket.id);
		expect(detailed?.attachments.some((a) => a.messageId === message.id)).toBe(true);
	});
});
