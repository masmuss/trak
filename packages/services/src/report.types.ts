import type { MessageSenderType, TicketWithRelations } from '@trak/shared';

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

export type TicketSortKey =
	'createdAt' | 'ticketCode' | 'title' | 'status' | 'priority' | 'slaResolveDue';

export type TicketFilters = {
	/** Comma-separated TicketStatus values (validated at the boundary, see toTicketStatusList). */
	status?: string;
	/** Comma-separated Priority values (validated at the boundary, see toPriorityList). */
	priority?: string;
	slaBreached?: string;
	search?: string;
	categoryId?: string;
	assignedTo?: string;
	/** Server-side sort column (validated against whitelist at the boundary). */
	sort?: string;
	/** Server-side sort direction. */
	order?: string;
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
	senderType: MessageSenderType;
	senderUserId?: string;
	senderReporterId?: string;
	body: string;
	isInternal?: boolean;
	attachments?: CreateMessageAttachmentInput[];
};
