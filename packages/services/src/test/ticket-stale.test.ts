import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { getStaleTickets, listTickets } from '../ticket-query.service';
import { createTicketMessage } from '../ticket-message.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

const HOUR_MS = 3_600_000;

async function backdateActivity(id: string, hoursAgo: number): Promise<void> {
	await db
		.update(reports)
		.set({ lastActivityAt: new Date(Date.now() - hoursAgo * HOUR_MS) })
		.where(eq(reports.id, id));
}

describe('getStaleTickets', () => {
	it('returns only open tickets inactive beyond the threshold, oldest first', async () => {
		const reporter = await createTestReporter();
		const fresh = await createTestTicket(reporter.id, { title: 'Fresh ticket' });
		const staleOld = await createTestTicket(reporter.id, { title: 'Stale old ticket' });
		const staleNew = await createTestTicket(reporter.id, { title: 'Stale new ticket' });
		const resolved = await createTestTicket(reporter.id, { title: 'Resolved ticket' });

		await backdateActivity(staleOld.id, 72);
		await backdateActivity(staleNew.id, 30);
		await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, resolved.id));
		await backdateActivity(resolved.id, 72);

		const result = await getStaleTickets(24);

		expect(result.map((t) => t.id)).toEqual([staleOld.id, staleNew.id]);
		expect(result.map((t) => t.id)).not.toContain(fresh.id);
	});

	it('agent reply bumps activity so the ticket is no longer stale', async () => {
		const reporter = await createTestReporter();
		const agent = await createTestUser('agent');
		const ticket = await createTestTicket(reporter.id, { title: 'Quiet ticket' });
		await backdateActivity(ticket.id, 72);

		expect((await getStaleTickets(24)).map((t) => t.id)).toContain(ticket.id);

		await createTicketMessage({
			reportId: ticket.id,
			senderType: 'agent',
			senderUserId: agent.id,
			body: 'Kami sedang menangani laporan ini'
		});

		expect((await getStaleTickets(24)).map((t) => t.id)).not.toContain(ticket.id);
	});

	it('rejects non-positive thresholds', async () => {
		await expect(getStaleTickets(0)).rejects.toThrow(/positive/);
		await expect(getStaleTickets(-5)).rejects.toThrow(/positive/);
		await expect(getStaleTickets(Number.NaN)).rejects.toThrow(/positive/);
	});
});

describe('listTickets stale filter and activity sort', () => {
	it('filters stale open tickets via staleHours and ignores garbage', async () => {
		const reporter = await createTestReporter();
		const fresh = await createTestTicket(reporter.id, { title: 'Fresh ticket' });
		const stale = await createTestTicket(reporter.id, { title: 'Stale ticket' });
		await backdateActivity(stale.id, 72);

		const filtered = await listTickets({ staleHours: '24', limit: 10, offset: 0 });
		expect(filtered.tickets.map((t) => t.id)).toEqual([stale.id]);
		expect(filtered.total).toBe(1);

		const garbage = await listTickets({ staleHours: 'banana', limit: 10, offset: 0 });
		expect(garbage.total).toBe(2);
		expect(garbage.tickets.map((t) => t.id)).toContain(fresh.id);
	});

	it('sorts by lastActivityAt ascending', async () => {
		const reporter = await createTestReporter();
		const first = await createTestTicket(reporter.id, { title: 'First ticket' });
		const second = await createTestTicket(reporter.id, { title: 'Second ticket' });
		await backdateActivity(first.id, 72);

		const result = await listTickets({
			sort: 'lastActivityAt',
			order: 'asc',
			limit: 10,
			offset: 0
		});

		expect(result.tickets.map((t) => t.id)).toEqual([first.id, second.id]);
	});
});
