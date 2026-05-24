import type { Category } from '$lib/features/category/types';
import type { Reporter } from '$lib/features/reporter/types';
import type { reports, reportAttachments, statusHistories, user } from '$lib/server/db/schema';

export type Ticket = typeof reports.$inferSelect;
export type Attachment = typeof reportAttachments.$inferSelect;
export type User = typeof user.$inferSelect;

export type StatusHistoryWithUser = typeof statusHistories.$inferSelect & {
	changedByUser: User;
};

export type TicketWithRelations = Ticket & {
	reporter: Reporter;
	category: Category | null;
};

export type TicketDetails = TicketWithRelations & {
	attachments: Attachment[];
	statusHistories: StatusHistoryWithUser[];
};
