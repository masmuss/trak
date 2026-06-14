import { sql } from 'drizzle-orm';
import { db } from '@trak/database';
import { notifications } from '@trak/database/schema';
import { eq } from 'drizzle-orm';
import type { CreateNotificationInput } from './notification.types';

export async function createNotification(input: CreateNotificationInput) {
	const result = await db
		.insert(notifications)
		.values({
			reporterTelegramId: input.reporterTelegramId,
			reportId: input.reportId,
			message: input.message
		})
		.returning({ id: notifications.id });

	const payload = JSON.stringify({
		notificationId: result[0].id,
		reporterTelegramId: Number(input.reporterTelegramId),
		message: input.message,
		reportId: input.reportId
	});

	await db.execute(sql`SELECT pg_notify('notifications', ${payload})`);
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
