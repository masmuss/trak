import { eq, count, gte, lt, and, isNotNull, or } from 'drizzle-orm';
import { db, reports, reporters, inviteCodes } from '@trak/database';
import type { TicketWithRelations } from '@trak/shared';
import type {
	CreationTrend,
	DashboardStats,
	DayData,
	PerformanceOverviewData,
	SlaCalendarData,
	SlaDeadline,
	TopInviteCode,
	VolumeDayData
} from './dashboard.types';

export async function getDashboardStats(): Promise<DashboardStats> {
	const [
		totalTickets,
		openTickets,
		totalReporters,
		activeInviteCodes,
		slaBreachedTickets,
		criticalTickets
	] = await Promise.all([
		db.select({ count: count() }).from(reports),
		db.select({ count: count() }).from(reports).where(eq(reports.status, 'open')),
		db.select({ count: count() }).from(reporters),
		db.select({ count: count() }).from(inviteCodes).where(eq(inviteCodes.isActive, true)),
		db.select({ count: count() }).from(reports).where(eq(reports.isSlaBreached, true)),
		db.select({ count: count() }).from(reports).where(eq(reports.priority, 'CRITICAL'))
	]);

	return {
		totalTickets: totalTickets[0]?.count ?? 0,
		openTickets: openTickets[0]?.count ?? 0,
		totalReporters: totalReporters[0]?.count ?? 0,
		activeInviteCodes: activeInviteCodes[0]?.count ?? 0,
		slaBreachedTickets: slaBreachedTickets[0]?.count ?? 0,
		criticalTickets: criticalTickets[0]?.count ?? 0
	};
}

export async function getRecentTickets(limit = 5): Promise<TicketWithRelations[]> {
	return db.query.reports.findMany({
		limit,
		where: (reports, { inArray }) => inArray(reports.status, ['open', 'in_progress']),
		with: {
			reporter: true,
			category: true,
			assignee: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	});
}

export async function getCriticalTickets(limit = 5): Promise<TicketWithRelations[]> {
	return db.query.reports.findMany({
		limit,
		where: (reports, { or, eq }) =>
			or(eq(reports.priority, 'CRITICAL'), eq(reports.isSlaBreached, true)),
		with: {
			reporter: true,
			category: true,
			assignee: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	});
}

export async function getTopInviteCodes(limit = 5): Promise<TopInviteCode[]> {
	return db.query.inviteCodes.findMany({
		limit,
		with: {
			reporters: {
				columns: { id: true }
			}
		},
		orderBy: (inviteCodes, { desc }) => [desc(inviteCodes.createdAt)]
	});
}

export async function getPerformanceOverview(): Promise<PerformanceOverviewData> {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
	sevenDaysAgo.setHours(0, 0, 0, 0);

	const recentReports = await db.query.reports.findMany({
		where: (reports, { gte }) => gte(reports.createdAt, sevenDaysAgo)
	});

	const totalReports = recentReports.length;
	const resolvedReports = recentReports.filter(
		(r) => r.status === 'resolved' || r.status === 'closed'
	).length;

	const chartDataMap = new Map<string, { totalResponseTime: number; count: number }>();

	for (let i = 0; i < 7; i++) {
		const d = new Date(sevenDaysAgo);
		d.setDate(d.getDate() + i);
		const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
		chartDataMap.set(dayName, { totalResponseTime: 0, count: 0 });
	}

	for (const report of recentReports) {
		const dayName = new Date(report.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
		const mapEntry = chartDataMap.get(dayName);

		if (mapEntry && report.firstRespondedAt) {
			const responseTimeMs =
				new Date(report.firstRespondedAt).getTime() - new Date(report.createdAt).getTime();

			if (responseTimeMs > 0) {
				mapEntry.totalResponseTime += responseTimeMs;
				mapEntry.count += 1;
			}
		}
	}

	const chartData: DayData[] = Array.from(chartDataMap.entries()).map(([day, stats]) => {
		const avgMs = stats.count > 0 ? stats.totalResponseTime / stats.count : 0;

		return { day, minutes: Math.round(avgMs / 60000) };
	});

	return {
		chartData,
		totalReports,
		resolvedReports
	};
}

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

/**
 * Daily created vs resolved counts for the last `days` days (inclusive today).
 * Days with zero activity are included so charts render a continuous axis.
 */
export async function getTicketVolume(days = 14): Promise<VolumeDayData[]> {
	if (!Number.isFinite(days) || days <= 0) {
		throw new Error('days must be a positive number');
	}
	const today = startOfDay(new Date());
	const start = new Date(today);
	start.setDate(start.getDate() - (days - 1));

	const rows = await db.query.reports.findMany({
		columns: { createdAt: true, status: true },
		where: gte(reports.createdAt, start)
	});

	const buckets = new Map<string, VolumeDayData>();
	for (let i = 0; i < days; i++) {
		const d = new Date(start);
		d.setDate(d.getDate() + i);
		const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		buckets.set(label, { day: label, created: 0, resolved: 0 });
	}

	for (const row of rows) {
		const label = new Date(row.createdAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
		const bucket = buckets.get(label);
		if (!bucket) continue;
		bucket.created += 1;
		if (row.status === 'resolved' || row.status === 'closed') bucket.resolved += 1;
	}

	return [...buckets.values()];
}

/**
 * Tickets created in the last 7 days vs the 7 days before, for trend badges.
 */
export async function getTicketCreationTrend(): Promise<CreationTrend> {
	const today = startOfDay(new Date());
	const currentStart = new Date(today);
	currentStart.setDate(currentStart.getDate() - 6);
	const previousStart = new Date(today);
	previousStart.setDate(previousStart.getDate() - 13);

	const rows = await db.query.reports.findMany({
		columns: { createdAt: true },
		where: gte(reports.createdAt, previousStart)
	});

	let current = 0;
	let previous = 0;
	for (const row of rows) {
		if (new Date(row.createdAt) >= currentStart) current += 1;
		else previous += 1;
	}

	return {
		current,
		previous,
		pctChange: previous === 0 ? null : Math.round(((current - previous) / previous) * 100)
	};
}

/**
 * SLA resolve deadlines for a calendar month plus still-open overdue tickets.
 * Only open / in_progress tickets count — resolved ones met (or missed) their SLA already.
 */
export async function getSlaCalendar(year: number, month: number): Promise<SlaCalendarData> {
	if (!Number.isInteger(year) || year < 2000 || year > 2100) {
		throw new Error('year must be an integer between 2000 and 2100');
	}
	if (!Number.isInteger(month) || month < 1 || month > 12) {
		throw new Error('month must be an integer between 1 and 12');
	}
	const monthStart = new Date(year, month - 1, 1);
	const monthEnd = new Date(year, month, 1);

	const rows = await db.query.reports.findMany({
		columns: {
			id: true,
			ticketCode: true,
			title: true,
			priority: true,
			status: true,
			slaResolveDue: true,
			isSlaBreached: true
		},
		where: and(
			or(eq(reports.status, 'open'), eq(reports.status, 'in_progress')),
			isNotNull(reports.slaResolveDue),
			lt(reports.slaResolveDue, monthEnd)
		),
		orderBy: (reports, { asc }) => [asc(reports.slaResolveDue)]
	});

	const deadlines: SlaDeadline[] = [];
	const overdue: SlaDeadline[] = [];
	for (const row of rows) {
		if (!row.slaResolveDue) continue;
		const entry: SlaDeadline = {
			id: row.id,
			ticketCode: row.ticketCode,
			title: row.title,
			priority: row.priority,
			status: row.status,
			slaResolveDue: row.slaResolveDue,
			isSlaBreached: row.isSlaBreached
		};
		if (new Date(row.slaResolveDue) >= monthStart) deadlines.push(entry);
		else overdue.push(entry);
	}

	return { year, month, deadlines, overdue };
}
