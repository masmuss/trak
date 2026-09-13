import { describe, expect, it } from 'vitest';
import { getAuditLogs, getAuditLogsCount } from '../audit.service';
import { claimTicket } from '../ticket-assignment.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

describe('audit query (viewer)', () => {
	it('counts logs with the same filters as the list query', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const first = await createTestTicket(reporter.id);
		const second = await createTestTicket(reporter.id);

		await claimTicket(first.id, { id: agent.id, role: 'agent' });
		await claimTicket(second.id, { id: agent.id, role: 'agent' });

		const total = await getAuditLogsCount({ action: 'ticket.assigned' });
		expect(total).toBeGreaterThanOrEqual(2);

		const page = await getAuditLogs({ action: 'ticket.assigned', limit: 1, offset: 1 });
		expect(page).toHaveLength(1);
		expect(total).toBeGreaterThanOrEqual(2);
	});

	it('filters by date range', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		await claimTicket(ticket.id, { id: agent.id, role: 'agent' });

		const future = new Date(Date.now() + 60 * 60 * 1000);
		expect(await getAuditLogsCount({ action: 'ticket.assigned', from: future })).toBe(0);

		const past = new Date(Date.now() - 60 * 60 * 1000);
		expect(
			await getAuditLogsCount({ action: 'ticket.assigned', from: past })
		).toBeGreaterThanOrEqual(1);
	});
});
