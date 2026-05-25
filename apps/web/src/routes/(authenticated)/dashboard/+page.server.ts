import type { PageServerLoad } from './$types';
import { getDashboardStats, getRecentTickets, getTopInviteCodes } from '@trak/services';

export const load: PageServerLoad = async () => {
	const [stats, recentReports, topInviteCodes] = await Promise.all([
		getDashboardStats(),
		getRecentTickets(5),
		getTopInviteCodes(5)
	]);

	return {
		stats: {
			totalReports: stats.totalTickets,
			openTickets: stats.openTickets,
			activeReporters: stats.totalReporters,
			inviteCodesUsed: stats.activeInviteCodes
		},
		recentReports,
		inviteCodes: topInviteCodes.map((code) => ({
			id: code.id,
			code: code.code,
			isActive: code.isActive,
			expiresAt: code.expiresAt,
			reporterCount: code.reporters.length
		}))
	};
};
