import type { Category } from '$lib/features/category/types';
import type { Reporter } from '$lib/features/reporter/types';
import type { reports } from '$lib/server/db/schema';

export type Ticket = typeof reports.$inferSelect;

export type TicketWithRelations = Ticket & {
	reporter: Reporter;
	category: Category | null;
};
