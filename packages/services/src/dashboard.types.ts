export type DashboardStats = {
	totalTickets: number;
	openTickets: number;
	totalReporters: number;
	activeInviteCodes: number;
};

export type TopInviteCode = {
	id: string;
	code: string;
	isActive: boolean;
	expiresAt: Date | null;
	reporters: { id: string }[];
};
