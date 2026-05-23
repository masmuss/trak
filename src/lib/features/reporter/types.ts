import type { reporters } from '$lib/server/db/schema';

export type Reporter = typeof reporters.$inferSelect;
