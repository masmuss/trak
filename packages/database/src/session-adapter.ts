import { eq } from 'drizzle-orm';
import { db } from './index';
import { botSessions } from './schema';

export function createPgSessionAdapter<T>() {
	return {
		read: async (key: string): Promise<T | undefined> => {
			const row = await db
				.select({ data: botSessions.data })
				.from(botSessions)
				.where(eq(botSessions.key, key))
				.limit(1);

			return row[0]?.data as T | undefined;
		},

		write: async (key: string, value: T): Promise<void> => {
			await db
				.insert(botSessions)
				.values({ key, data: value as any })
				.onConflictDoUpdate({
					target: botSessions.key,
					set: { data: value as any, updatedAt: new Date() }
				});
		},

		delete: async (key: string): Promise<void> => {
			await db.delete(botSessions).where(eq(botSessions.key, key));
		}
	};
}
