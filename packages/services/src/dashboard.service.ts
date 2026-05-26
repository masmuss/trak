import { eq, count } from 'drizzle-orm';
import { db, reports, reporters, inviteCodes } from '@trak/database';
import type { TicketWithRelations } from '@trak/shared';

export type DashboardStats = {
	totalTickets: number;
	openTickets: number;
	totalReporters: number;
	activeInviteCodes: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
	const [totalTickets, openTickets, totalReporters, activeInviteCodes] = await Promise.all([
		db.select({ count: count() }).from(reports),
		db.select({ count: count() }).from(reports).where(eq(reports.status, 'open')),
		db.select({ count: count() }).from(reporters),
		db.select({ count: count() }).from(inviteCodes).where(eq(inviteCodes.isActive, true))
	]);

	return {
		totalTickets: totalTickets[0]?.count ?? 0,
		openTickets: openTickets[0]?.count ?? 0,
		totalReporters: totalReporters[0]?.count ?? 0,
		activeInviteCodes: activeInviteCodes[0]?.count ?? 0
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

export type TopInviteCode = {
	id: string;
	code: string;
	isActive: boolean;
	expiresAt: Date | null;
	reporters: { id: string }[];
};

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
