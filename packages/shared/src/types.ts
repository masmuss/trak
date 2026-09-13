import type {
	reports,
	reportAttachments,
	statusHistories,
	ticketMessages,
	user,
	reporters,
	categories,
	inviteCodes
} from '@trak/database';

export type Ticket = typeof reports.$inferSelect;
export type Attachment = typeof reportAttachments.$inferSelect;
export type User = typeof user.$inferSelect;
export type StatusHistory = typeof statusHistories.$inferSelect;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type Reporter = typeof reporters.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type InviteCode = typeof inviteCodes.$inferSelect;

export type UserRole = 'admin' | 'agent';

export function isUserRole(value: unknown): value is UserRole {
	return value === 'admin' || value === 'agent';
}

export type Actor = {
	id: string;
	role: UserRole;
};

export class ForbiddenError extends Error {
	constructor(message = 'Forbidden') {
		super(message);
		this.name = 'ForbiddenError';
	}
}

export function requireActorRole(actor: Actor, ...roles: UserRole[]): void {
	if (!roles.includes(actor.role)) {
		throw new ForbiddenError(`Requires one of roles: ${roles.join(', ')}`);
	}
}

export type MessageVisibility = 'public' | 'internal';

export type StatusHistoryWithUser = StatusHistory & {
	changedByUser: User | null;
};

export type TicketWithRelations = Ticket & {
	reporter: Reporter;
	category: Category | null;
	assignee: User | null;
};

export type TicketDetails = TicketWithRelations & {
	attachments: Attachment[];
	statusHistories: StatusHistoryWithUser[];
	messages: (TicketMessage & {
		senderUser: User | null;
		senderReporter: Reporter | null;
		attachments: Attachment[];
	})[];
};
