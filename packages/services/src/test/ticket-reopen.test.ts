import { describe, expect, it } from 'vitest';
import { createReporterTicketMessage } from '../ticket-message.service';
import { updateTicketStatus } from '../ticket-status.service';
import { claimTicket } from '../ticket-assignment.service';
import { getTicketById } from '../ticket-query.service';
import { getAuditLogs } from '../audit.service';
import { getAgentNotifications } from '../notification.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

async function resolveTicket(ticketId: string) {
	const admin = await createTestUser('admin');
	await updateTicketStatus(ticketId, 'resolved', { id: admin.id, role: 'admin' });
}

describe('reporter reply + reopen', () => {
	it('reopens a resolved ticket and resets SLA', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		await resolveTicket(ticket.id);

		const before = await getTicketById(ticket.id);
		expect(before?.status).toBe('resolved');
		expect(before?.resolvedAt).toBeInstanceOf(Date);

		const message = await createReporterTicketMessage({
			reportId: ticket.id,
			senderReporterId: reporter.id,
			body: 'Masih bermasalah, mohon dibuka lagi'
		});

		expect(message.senderType).toBe('reporter');

		const after = await getTicketById(ticket.id);
		expect(after?.status).toBe('open');
		expect(after?.resolvedAt).toBeNull();
		expect(after?.isSlaBreached).toBe(false);
		expect(after?.slaResponseDue).toBeInstanceOf(Date);
		expect(after?.slaResolveDue).toBeInstanceOf(Date);

		const reopenEntry = after?.statusHistories.find(
			(h) => h.oldStatus === 'resolved' && h.newStatus === 'open'
		);
		expect(reopenEntry?.note).toMatch(/reopen/i);
	});

	it('writes audit logs and notifies the assignee on reopen', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		await claimTicket(ticket.id, { id: agent.id, role: 'agent' });
		await resolveTicket(ticket.id);

		const message = await createReporterTicketMessage({
			reportId: ticket.id,
			senderReporterId: reporter.id,
			body: 'Balasan setelah resolve'
		});

		const auditLogs = await getAuditLogs({ action: 'ticket.reopened' });
		expect(auditLogs.some((log) => log.entityId === ticket.id)).toBe(true);

		const messageLogs = await getAuditLogs({ action: 'ticket.message_created' });
		expect(messageLogs.some((log) => log.entityId === message.id)).toBe(true);

		const notifications = await getAgentNotifications(agent.id);
		expect(notifications.some((n) => n.reportId === ticket.id && n.type === 'reporter_reply')).toBe(
			true
		);
	});

	it('rejects replies to closed tickets', async () => {
		const admin = await createTestUser('admin');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		await updateTicketStatus(ticket.id, 'closed', { id: admin.id, role: 'admin' });

		await expect(
			createReporterTicketMessage({
				reportId: ticket.id,
				senderReporterId: reporter.id,
				body: 'Halo?'
			})
		).rejects.toThrow(/closed/i);
	});

	it('rejects replies from non-owning reporters', async () => {
		const owner = await createTestReporter();
		const stranger = await createTestReporter();
		const ticket = await createTestTicket(owner.id);

		await expect(
			createReporterTicketMessage({
				reportId: ticket.id,
				senderReporterId: stranger.id,
				body: 'Bukan tiket saya'
			})
		).rejects.toThrow(/own/i);
	});
});
