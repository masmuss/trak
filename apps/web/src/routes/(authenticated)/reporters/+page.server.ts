import type { PageServerLoad } from './$types';
import { getReporters } from '@trak/services';

export const load: PageServerLoad = async () => {
	const allReporters = await getReporters();

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
