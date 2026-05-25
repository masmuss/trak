import { db, reporters } from '@trak/database';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allReporters = await db.query.reporters.findMany({
		with: {
			inviteCode: true,
			reports: true
		},
		orderBy: [desc(reporters.createdAt)]
	});

	const rows = allReporters.map((r) => ({
		id: r.id,
		telegramId: r.telegramId.toString(),
		username: r.username,
		fullName: r.fullName,
		inviteCodeId: r.inviteCodeId,
		inviteCode: r.inviteCode ? { code: r.inviteCode.code } : null,
		reportCount: r.reports?.length ?? 0,
		createdAt: r.createdAt,
		updatedAt: r.updatedAt
	}));

	return {
		reporters: rows
	};
};
