import type { PageServerLoad } from './$types';
import {
	getDashboardStats,
	getRecentTickets,
	getTopInviteCodes,
	getCriticalTickets,
	getPerformanceOverview
} from '@trak/services';

export const load: PageServerLoad = async () => {
	const [stats, recentReports, topInviteCodes, criticalReports, performanceOverview] =
		await Promise.all([
			getDashboardStats(),
			getRecentTickets(5),
			getTopInviteCodes(5),
			getCriticalTickets(5),
			getPerformanceOverview()
		]);

	return {
		stats: {
			totalReports: stats.totalTickets,
			openTickets: stats.openTickets,
			activeReporters: stats.totalReporters,
			inviteCodesUsed: stats.activeInviteCodes,
			slaBreachedTickets: stats.slaBreachedTickets,
			criticalTickets: stats.criticalTickets
		},
		recentReports,
		criticalReports,
		performanceOverview,
		inviteCodes: topInviteCodes.map((code) => ({
			id: code.id,
			code: code.code,
			isActive: code.isActive,
			expiresAt: code.expiresAt,
			reporterCount: code.reporters.length
		}))
	};
};
