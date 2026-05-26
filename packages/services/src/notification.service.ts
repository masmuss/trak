import { db } from '@trak/database';
import { notifications } from '@trak/database/schema';
import { eq, and } from 'drizzle-orm';

export type CreateNotificationInput = {
	reporterTelegramId: bigint;
	reportId: string;
	message: string;
};

export async function createNotification(input: CreateNotificationInput) {
	await db.insert(notifications).values({
		reporterTelegramId: input.reporterTelegramId,
		reportId: input.reportId,
		message: input.message
	});
}

export async function getPendingNotifications() {
	return db
		.select()
		.from(notifications)
		.where(eq(notifications.isRead, false))
		.orderBy(notifications.createdAt)
		.limit(20);
}

export async function markNotificationRead(id: string) {
	await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}
