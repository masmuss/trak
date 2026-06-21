export type DashboardStats = {
	totalTickets: number;
	openTickets: number;
	totalReporters: number;
	activeInviteCodes: number;
	slaBreachedTickets: number;
	criticalTickets: number;
};

export type DayData = { day: string; minutes: number };
export type PerformanceOverviewData = {
	chartData: DayData[];
	totalReports: number;
	resolvedReports: number;
};

export type TopInviteCode = {
	id: string;
	code: string;
	isActive: boolean;
	expiresAt: Date | null;
	reporters: { id: string }[];
};
