import { botSessions, db } from '@trak/database';
import { lt } from 'drizzle-orm';

export async function cleanUpStaleSessions(): Promise<number> {
	const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
	const deleted = await db
		.delete(botSessions)
		.where(lt(botSessions.updatedAt, staleThreshold))
		.returning({
			key: botSessions.key
		});

	return deleted.length;
}
