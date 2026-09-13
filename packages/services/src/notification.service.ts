import { and, eq, sql } from 'drizzle-orm';
import { db } from '@trak/database';
import { agentNotifications, notifications } from '@trak/database/schema';
import type { AgentNotificationType } from '@trak/shared';
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

export async function publishAgentNotification(input: {
	reportId: string;
	messageId: string;
	message: string;
}) {
	const payload = JSON.stringify(input);
	await db.execute(sql`SELECT pg_notify('agent_notifications', ${payload})`);
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

export type AgentNotification = typeof agentNotifications.$inferSelect;

export async function createAgentNotification(input: {
	recipientUserId: string;
	reportId: string;
	messageId?: string;
	type: AgentNotificationType;
	message: string;
}) {
	const [notification] = await db.insert(agentNotifications).values(input).returning();

	await db.execute(
		sql`SELECT pg_notify('agent_notifications', ${JSON.stringify({
			notificationId: notification.id,
			recipientUserId: input.recipientUserId,
			reportId: input.reportId,
			messageId: input.messageId,
			type: input.type,
			message: input.message
		})})`
	);

	return notification;
}

export async function getAgentNotifications(userId: string, limit = 20) {
	return db
		.select()
		.from(agentNotifications)
		.where(eq(agentNotifications.recipientUserId, userId))
		.orderBy(agentNotifications.createdAt)
		.limit(limit);
}

export async function getUnreadAgentNotificationCount(userId: string) {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(agentNotifications)
		.where(
			and(eq(agentNotifications.recipientUserId, userId), eq(agentNotifications.isRead, false))
		);
	return Number(result[0]?.count ?? 0);
}

export async function markAgentNotificationRead(id: string, userId: string) {
	await db
		.update(agentNotifications)
		.set({ isRead: true })
		.where(and(eq(agentNotifications.id, id), eq(agentNotifications.recipientUserId, userId)));
}
