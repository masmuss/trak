import { describe, expect, it } from 'vitest';
import { submitReportWithAttachments } from '../ticket-submit.service';
import { getTicketById } from '../ticket-query.service';
import { getAuditLogs } from '../audit.service';
import { createTestReporter } from './helpers';

describe('submitReportWithAttachments', () => {
	it('creates ticket + attachments + audit in one call', async () => {
		const reporter = await createTestReporter();

		const { id, ticketCode } = await submitReportWithAttachments({
			reporterId: reporter.id,
			categoryId: null,
			title: 'Lampu lorong mati',
			body: 'Lampu lorong lantai 2 mati sejak kemarin',
			attachments: [
				{ fileId: 'f1', fileType: 'image/jpeg', storageUrl: 'telegram://f1' },
				{ fileId: 'f2', fileType: 'image/jpeg', storageUrl: 'telegram://f2' }
			]
		});

		expect(ticketCode).toMatch(/^TKT-/);

		const ticket = await getTicketById(id);
		expect(ticket?.title).toBe('Lampu lorong mati');
		expect(ticket?.status).toBe('open');
		expect(ticket?.priority).toBe('MEDIUM');
		expect(ticket?.attachments).toHaveLength(2);

		const logs = await getAuditLogs({ action: 'ticket.created' });
		expect(logs.some((log) => log.entityId === id)).toBe(true);
	});

	it('rejects empty title/body and oversized input', async () => {
		const reporter = await createTestReporter();

		await expect(
			submitReportWithAttachments({
				reporterId: reporter.id,
				title: '   ',
				body: 'Isi',
				attachments: []
			})
		).rejects.toThrow(/title/i);

		await expect(
			submitReportWithAttachments({
				reporterId: reporter.id,
				title: 'Judul',
				body: '',
				attachments: []
			})
		).rejects.toThrow(/body/i);

		await expect(
			submitReportWithAttachments({
				reporterId: reporter.id,
				title: 'x'.repeat(201),
				body: 'Isi',
				attachments: []
			})
		).rejects.toThrow(/200/);
	});
});
