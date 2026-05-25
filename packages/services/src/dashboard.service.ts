import { eq, count } from 'drizzle-orm';
import { db, reports, reporters, inviteCodes } from '@trak/database';

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

export type RecentTicket = {
	id: string;
	title: string;
	status: string;
	createdAt: Date;
	reporter: { fullName: string } | null;
	category: { name: string } | null;
};

export async function getRecentTickets(limit = 5): Promise<RecentTicket[]> {
	return db.query.reports.findMany({
		limit,
		with: {
			reporter: {
				columns: { fullName: true }
			},
			category: {
				columns: { name: true }
			}
		},
		orderBy: (reports, { desc }) => [desc(reports.createdAt)]
	}) as Promise<RecentTicket[]>;
}

export type TopInviteCode = {
	id: string;
	code: string;
	isActive: boolean;
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
