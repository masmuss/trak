import { count, eq } from 'drizzle-orm';
import { db, reports, reporters, inviteCodes } from '@trak/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [totalReports] = await db.select({ count: count() }).from(reports);
	const [openTickets] = await db
		.select({ count: count() })
		.from(reports)
		.where(eq(reports.status, 'open'));
	const [activeReporters] = await db.select({ count: count() }).from(reporters);
	const [usedCodes] = await db
		.select({ count: count() })
		.from(inviteCodes)
		.where(eq(inviteCodes.isActive, true));

	const recentReports = await db.query.reports.findMany({
		limit: 5,
		with: {
			reporter: true,
			category: true
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	});

	const topInviteCodes = await db.query.inviteCodes.findMany({
		limit: 5,
		with: {
			reporters: true
		},
		orderBy: (inviteCodes, { desc }) => [desc(inviteCodes.createdAt)]
	});

	return {
		stats: {
			totalReports: totalReports?.count ?? 0,
			openTickets: openTickets?.count ?? 0,
			activeReporters: activeReporters?.count ?? 0,
			inviteCodesUsed: usedCodes?.count ?? 0
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
