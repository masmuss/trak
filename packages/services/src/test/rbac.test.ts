import { describe, expect, it } from 'vitest';
import { ForbiddenError, type Actor } from '@trak/shared';
import { claimTicket, assignTicket } from '../ticket-assignment.service';
import { updateTicketPriority, updateTicketStatus } from '../ticket-status.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

function actor(id: string, role: Actor['role']): Actor {
	return { id, role };
}

describe('RBAC matrix', () => {
	it('agent: claim + status ok, assign + priority forbidden', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		const agentActor = actor(agent.id, 'agent');

		await expect(claimTicket(ticket.id, agentActor)).resolves.toBe(true);
		await expect(updateTicketStatus(ticket.id, 'in_progress', agentActor)).resolves.toBeUndefined();
		await expect(assignTicket(ticket.id, agent.id, agentActor)).rejects.toBeInstanceOf(
			ForbiddenError
		);
		await expect(updateTicketPriority(ticket.id, 'HIGH', agentActor)).rejects.toBeInstanceOf(
			ForbiddenError
		);
	});

	it('admin: full access', async () => {
		const admin = await createTestUser('admin');
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		const adminActor = actor(admin.id, 'admin');

		await expect(claimTicket(ticket.id, adminActor)).resolves.toBe(true);
		await expect(updateTicketStatus(ticket.id, 'in_progress', adminActor)).resolves.toBeUndefined();
		await expect(assignTicket(ticket.id, agent.id, adminActor)).resolves.toBeUndefined();
		await expect(updateTicketPriority(ticket.id, 'CRITICAL', adminActor)).resolves.toBeUndefined();
	});

	it('unknown role: denied everywhere', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);
		const badActor = { id: 'x', role: 'viewer' } as unknown as Actor;

		await expect(claimTicket(ticket.id, badActor)).rejects.toBeInstanceOf(ForbiddenError);
		await expect(assignTicket(ticket.id, null, badActor)).rejects.toBeInstanceOf(ForbiddenError);
		await expect(updateTicketStatus(ticket.id, 'open', badActor)).rejects.toBeInstanceOf(
			ForbiddenError
		);
		await expect(updateTicketPriority(ticket.id, 'LOW', badActor)).rejects.toBeInstanceOf(
			ForbiddenError
		);
	});

	it('ForbiddenError carries a reviewable message', async () => {
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const error = await assignTicket(ticket.id, agent.id, actor(agent.id, 'agent')).catch((e) => e);
		expect(error).toBeInstanceOf(ForbiddenError);
		expect((error as ForbiddenError).message).toMatch(/admin/i);
	});
});
