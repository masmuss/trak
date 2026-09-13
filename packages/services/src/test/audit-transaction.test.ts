import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { createAuditLog, getAuditLogs } from '../audit.service';
import { updateTicketStatus } from '../ticket-status.service';
import { getTicketByIdSimple } from '../ticket-query.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

describe('audit in transaction (strict rollback)', () => {
	it('rolls back the business write when the audit insert fails', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await expect(
			db.transaction(async (tx) => {
				await tx.update(reports).set({ status: 'in_progress' }).where(eq(reports.id, ticket.id));
				await createAuditLog(
					{
						action: 'ticket.status_changed',
						entityType: 'ticket',
						entityId: null as unknown as string
					},
					tx
				);
			})
		).rejects.toThrow();

		const after = await getTicketByIdSimple(ticket.id);
		expect(after?.status).toBe('open');
	});

	it('writes the status audit in the same transaction as the update', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await updateTicketStatus(ticket.id, 'in_progress', { id: agent.id, role: 'agent' });

		const logs = await getAuditLogs({ action: 'ticket.status_changed' });
		const entry = logs.find((log) => log.entityId === ticket.id);
		expect(entry?.actor?.id).toBe(agent.id);
	});
});
