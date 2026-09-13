import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { ForbiddenError } from '@trak/shared';
import { db, user } from '@trak/database';
import { assignTicket, claimTicket, getActiveTicketCounts } from '../ticket-assignment.service';
import { getAgentNotifications } from '../notification.service';
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

	it('notifies the new assignee on manual assignment', async () => {
		const admin = await createTestUser('admin');
		const agent = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await assignTicket(ticket.id, agent.id, { id: admin.id, role: 'admin' });

		const notifications = await getAgentNotifications(agent.id);
		expect(notifications.some((n) => n.reportId === ticket.id && n.type === 'assignment')).toBe(
			true
		);
	});

	it('rejects unknown, inactive, or wrong-role assignees', async () => {
		const admin = await createTestUser('admin');
		const adminActor = { id: admin.id, role: 'admin' } as const;
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await expect(assignTicket(ticket.id, 'no-such-user', adminActor)).rejects.toThrow(/not found/i);

		const inactive = await createTestUser('agent');
		await db.update(user).set({ isActive: false }).where(eq(user.id, inactive.id));
		await expect(assignTicket(ticket.id, inactive.id, adminActor)).rejects.toThrow(/not active/i);

		const viewerId = `viewer-${Date.now()}`;
		await db.insert(user).values({
			id: viewerId,
			name: 'Viewer',
			email: `${viewerId}@test.local`,
			role: 'viewer',
			isActive: true
		});
		await expect(assignTicket(ticket.id, viewerId, adminActor)).rejects.toBeInstanceOf(
			ForbiddenError
		);

		const updated = await getTicketByIdSimple(ticket.id);
		expect(updated?.assignedTo).toBeNull();
	});

	it('notifies the previous assignee on reassign and unassign', async () => {
		const admin = await createTestUser('admin');
		const adminActor = { id: admin.id, role: 'admin' } as const;
		const first = await createTestUser('agent');
		const second = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await assignTicket(ticket.id, first.id, adminActor);
		await assignTicket(ticket.id, second.id, adminActor);

		let firstNotes = await getAgentNotifications(first.id);
		expect(firstNotes.some((n) => n.reportId === ticket.id && /dipindahkan/i.test(n.message))).toBe(
			true
		);
		let secondNotes = await getAgentNotifications(second.id);
		expect(secondNotes.some((n) => n.reportId === ticket.id && /ditugaskan/i.test(n.message))).toBe(
			true
		);

		await assignTicket(ticket.id, null, adminActor);
		secondNotes = await getAgentNotifications(second.id);
		expect(secondNotes.some((n) => n.reportId === ticket.id && /dihapus/i.test(n.message))).toBe(
			true
		);
	});

	it('counts active tickets per agent', async () => {
		const admin = await createTestUser('admin');
		const adminActor = { id: admin.id, role: 'admin' } as const;
		const busy = await createTestUser('agent');
		const idle = await createTestUser('agent');
		const reporter = await createTestReporter();
		const first = await createTestTicket(reporter.id);
		const second = await createTestTicket(reporter.id);

		await assignTicket(first.id, busy.id, adminActor);
		await assignTicket(second.id, busy.id, adminActor);

		const counts = await getActiveTicketCounts();
		const busyRow = counts.find((row) => row.userId === busy.id);
		expect(busyRow?.activeTickets).toBe(2);
		expect(counts.some((row) => row.userId === idle.id)).toBe(false);
	});
});
