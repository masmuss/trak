import type {
	reports,
	reportAttachments,
	statusHistories,
	user,
	reporters,
	categories
} from '@trak/database';

export type Ticket = typeof reports.$inferSelect;
export type Attachment = typeof reportAttachments.$inferSelect;
export type User = typeof user.$inferSelect;
export type StatusHistory = typeof statusHistories.$inferSelect;
export type Reporter = typeof reporters.$inferSelect;
export type Category = typeof categories.$inferSelect;

export type StatusHistoryWithUser = StatusHistory & {
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
