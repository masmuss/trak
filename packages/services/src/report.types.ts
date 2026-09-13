import type { TicketWithRelations } from '@trak/shared';

export type TicketListItem = TicketWithRelations;

export type TicketListResult = {
	tickets: TicketListItem[];
	total: number;
};

export type TicketStats = {
	total: number;
	pending: number;
	solved: number;
};

export type TicketFilters = {
	status?: string;
	priority?: string;
	slaBreached?: string;
	search?: string;
	categoryId?: string;
	limit?: number;
	offset?: number;
};

export type CategoryDistribution = {
	categoryId: string;
	categoryName: string;
	count: number;
	percentage: number;
};

export type DistributionResult = {
	distribution: CategoryDistribution[];
	uncategorized: number;
};

export type CreateReportInput = {
	reporterId: string;
	categoryId?: string | null;
	title: string;
	body: string;
};

export type CreateAttachmentInput = {
	reportId: string;
	fileId: string;
	fileType: string;
	storageUrl: string;
};

export type CreateMessageAttachmentInput = Omit<CreateAttachmentInput, 'reportId'>;

export type CreateTicketMessageInput = {
	reportId: string;
	senderType: 'agent' | 'reporter' | 'system';
	senderUserId?: string;
	senderReporterId?: string;
	body: string;
	isInternal?: boolean;
	attachments?: CreateMessageAttachmentInput[];
};
