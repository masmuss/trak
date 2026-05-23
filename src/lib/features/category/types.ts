import type { categories } from '$lib/server/db/schema';

export type Category = typeof categories.$inferSelect;
