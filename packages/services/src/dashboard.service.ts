import { eq, count } from 'drizzle-orm';
import { db, reports, reporters, inviteCodes } from '@trak/database';
import type { TicketWithRelations } from '@trak/shared';
import type {
	DashboardStats,
	DayData,
	PerformanceOverviewData,
	TopInviteCode
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
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	}) as Promise<TicketWithRelations[]>;
}

export async function getCriticalTickets(limit = 5): Promise<TicketWithRelations[]> {
	return db.query.reports.findMany({
		limit,
		where: (reports, { or, eq }) =>
			or(eq(reports.priority, 'CRITICAL'), eq(reports.isSlaBreached, true)),
		with: {
			reporter: true,
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	}) as Promise<TicketWithRelations[]>;
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
	}) as Promise<TopInviteCode[]>;
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
