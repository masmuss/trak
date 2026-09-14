import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { getSlaCalendar, getTicketCreationTrend, getTicketVolume } from '../dashboard.service';
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

describe('getSlaCalendar', () => {
	async function setDue(id: string, due: Date): Promise<void> {
		await db.update(reports).set({ slaResolveDue: due }).where(eq(reports.id, id));
	}

	it('splits month deadlines from overdue and excludes resolved', async () => {
		const reporter = await createTestReporter();
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1;

		const inMonth = await createTestTicket(reporter.id, { title: 'Due this month' });
		await setDue(inMonth.id, new Date(year, month - 1, 15, 12, 0, 0));

		const overdue = await createTestTicket(reporter.id, { title: 'Overdue ticket' });
		await setDue(overdue.id, new Date(Date.now() - 30 * DAY_MS));

		const resolved = await createTestTicket(reporter.id, { title: 'Resolved ticket' });
		await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, resolved.id));
		await setDue(resolved.id, new Date(year, month - 1, 10, 12, 0, 0));

		const data = await getSlaCalendar(year, month);

		expect(data.deadlines.map((d) => d.id)).toContain(inMonth.id);
		expect(data.overdue.map((d) => d.id)).toContain(overdue.id);
		expect([...data.deadlines, ...data.overdue].map((d) => d.id)).not.toContain(resolved.id);
	});

	it('rejects out-of-range year and month', async () => {
		await expect(getSlaCalendar(1999, 5)).rejects.toThrow(/year/);
		await expect(getSlaCalendar(2026, 0)).rejects.toThrow(/month/);
		await expect(getSlaCalendar(2026, 13)).rejects.toThrow(/month/);
	});
});
