import { describe, expect, it } from 'vitest';
import { ForbiddenError } from '@trak/shared';
import { claimTicket, assignTicket } from '../ticket-assignment.service';
import { getTicketByIdSimple } from '../ticket-query.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

describe('claimTicket (atomic)', () => {
	it('lets an agent claim an unassigned ticket', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const claimed = await claimTicket(ticket.id, { id: agent.id, role: 'agent' });

		expect(claimed).toBe(true);
		const updated = await getTicketByIdSimple(ticket.id);
		expect(updated?.assignedTo).toBe(agent.id);
		expect(updated?.assignedBy).toBe(agent.id);
		expect(updated?.assignedAt).toBeInstanceOf(Date);
	});

	it('rejects a second claim on an assigned ticket', async () => {
		const first = await createTestUser('agent');
		const second = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		expect(await claimTicket(ticket.id, { id: first.id, role: 'agent' })).toBe(true);
		expect(await claimTicket(ticket.id, { id: second.id, role: 'agent' })).toBe(false);

		const updated = await getTicketByIdSimple(ticket.id);
		expect(updated?.assignedTo).toBe(first.id);
	});

	it('grants exactly one winner under concurrent claims', async () => {
		const agents = await Promise.all([createTestUser('agent'), createTestUser('agent')]);
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const results = await Promise.all(
			agents.map((agent) => claimTicket(ticket.id, { id: agent.id, role: 'agent' }))
		);

		expect(results.filter(Boolean)).toHaveLength(1);
	});

	it('rejects actors without agent/admin role', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await expect(
			claimTicket(ticket.id, { id: 'someone', role: 'reporter' as never })
		).rejects.toBeInstanceOf(ForbiddenError);
	});
});

describe('assignTicket (authorization + behavior)', () => {
	it('lets admin assign and unassign', async () => {
		const admin = await createTestUser('admin');
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await assignTicket(ticket.id, agent.id, { id: admin.id, role: 'admin' });
		let updated = await getTicketByIdSimple(ticket.id);
		expect(updated?.assignedTo).toBe(agent.id);
		expect(updated?.assignedAt).toBeInstanceOf(Date);

		await assignTicket(ticket.id, null, { id: admin.id, role: 'admin' });
		updated = await getTicketByIdSimple(ticket.id);
		expect(updated?.assignedTo).toBeNull();
		expect(updated?.assignedAt).toBeNull();
	});

	it('forbids non-admin assignment', async () => {
		const agent = await createTestUser('agent');
		const target = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await expect(
			assignTicket(ticket.id, target.id, { id: agent.id, role: 'agent' })
		).rejects.toBeInstanceOf(ForbiddenError);

		const updated = await getTicketByIdSimple(ticket.id);
		expect(updated?.assignedTo).toBeNull();
	});
});
