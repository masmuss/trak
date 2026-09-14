import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { getTicketCreationTrend, getTicketVolume } from '../dashboard.service';
import { createTestReporter, createTestTicket } from './helpers';

const DAY_MS = 24 * 3_600_000;

async function backdateCreated(id: string, daysAgo: number): Promise<void> {
	await db
		.update(reports)
		.set({ createdAt: new Date(Date.now() - daysAgo * DAY_MS) })
		.where(eq(reports.id, id));
}

describe('getTicketVolume', () => {
	it('buckets created vs resolved per day over the window', async () => {
		const reporter = await createTestReporter();
		const open = await createTestTicket(reporter.id, { title: 'Volume open' });
		const old = await createTestTicket(reporter.id, { title: 'Volume old' });
		await backdateCreated(old.id, 3);
		await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, old.id));

		const volume = await getTicketVolume(14);

		expect(volume).toHaveLength(14);
		const total = volume.reduce(
			(acc, day) => ({ created: acc.created + day.created, resolved: acc.resolved + day.resolved }),
			{ created: 0, resolved: 0 }
		);
		expect(total.created).toBe(2);
		expect(total.resolved).toBe(1);
		expect(open.id).toBeTruthy();
	});

	it('rejects non-positive windows', async () => {
		await expect(getTicketVolume(0)).rejects.toThrow(/positive/);
	});
});

describe('getTicketCreationTrend', () => {
	it('compares last 7 days against the prior 7 days', async () => {
		const reporter = await createTestReporter();
		const current = await createTestTicket(reporter.id, { title: 'Trend current' });
		const previous = await createTestTicket(reporter.id, { title: 'Trend previous' });
		await backdateCreated(previous.id, 10);

		const trend = await getTicketCreationTrend();

		expect(trend.current).toBe(1);
		expect(trend.previous).toBe(1);
		expect(trend.pctChange).toBe(0);
		expect(current.id).toBeTruthy();
	});

	it('returns null change when the previous window is empty', async () => {
		const reporter = await createTestReporter();
		await createTestTicket(reporter.id, { title: 'Trend lonely' });

		const trend = await getTicketCreationTrend();

		expect(trend.current).toBe(1);
		expect(trend.previous).toBe(0);
		expect(trend.pctChange).toBeNull();
	});
});
