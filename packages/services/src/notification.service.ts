import { and, eq, lt, sql } from 'drizzle-orm';
import { db } from '@trak/database';
import { agentNotifications, notifications } from '@trak/database/schema';
import type { AgentNotificationType } from '@trak/shared';
import type { CreateNotificationInput } from './notification.types';

export const NOTIFICATION_RETENTION_DAYS = 30;

export async function createNotification(input: CreateNotificationInput) {
	const dedupKey = input.dedupKey ?? `${input.reportId}:${input.type}:${input.message}`;

	const inserted = await db
		.insert(notifications)
		.values({
			reporterTelegramId: input.reporterTelegramId,
			reportId: input.reportId,
			type: input.type,
			message: input.message,
			dedupKey
		})
		.onConflictDoNothing({ target: notifications.dedupKey })
		.returning({ id: notifications.id });

	const row =
		inserted[0] ??
		(await db.query.notifications.findFirst({
			where: eq(notifications.dedupKey, dedupKey),
			columns: { id: true }
		}));
	if (!row) throw new Error('Failed to create notification');

	const payload = JSON.stringify({
		notificationId: row.id,
		reporterTelegramId: Number(input.reporterTelegramId),
		message: input.message,
		reportId: input.reportId
	});

	await db.execute(sql`SELECT pg_notify('notifications', ${payload})`);
	return row;
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

export async function markAllNotificationsRead(reporterTelegramId: bigint) {
	await db
		.update(notifications)
		.set({ isRead: true })
		.where(
			and(eq(notifications.reporterTelegramId, reporterTelegramId), eq(notifications.isRead, false))
		);
}

export type AgentNotification = typeof agentNotifications.$inferSelect;

export async function createAgentNotification(input: {
	recipientUserId: string;
	reportId: string;
	messageId?: string;
	type: AgentNotificationType;
	message: string;
	dedupKey?: string;
}) {
	const dedupKey =
		input.dedupKey ??
		`${input.recipientUserId}:${input.reportId}:${input.type}:${input.messageId ?? input.message}`;

	const inserted = await db
		.insert(agentNotifications)
		.values({ ...input, dedupKey })
		.onConflictDoNothing({ target: agentNotifications.dedupKey })
		.returning();

	const notification =
		inserted[0] ??
		(await db.query.agentNotifications.findFirst({
			where: eq(agentNotifications.dedupKey, dedupKey)
		}));
	if (!notification) throw new Error('Failed to create agent notification');

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

export async function markAllAgentNotificationsRead(userId: string) {
	await db
		.update(agentNotifications)
		.set({ isRead: true })
		.where(
			and(eq(agentNotifications.recipientUserId, userId), eq(agentNotifications.isRead, false))
		);
}

export async function purgeReadNotifications(olderThanDays = NOTIFICATION_RETENTION_DAYS) {
	const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
	const scope = and(eq(notifications.isRead, true), lt(notifications.createdAt, cutoff));
	const agentScope = and(
		eq(agentNotifications.isRead, true),
		lt(agentNotifications.createdAt, cutoff)
	);

	const [deletedReporter, deletedAgent] = await Promise.all([
		db.delete(notifications).where(scope).returning({ id: notifications.id }),
		db.delete(agentNotifications).where(agentScope).returning({ id: agentNotifications.id })
	]);

	return { reporter: deletedReporter.length, agent: deletedAgent.length };
}
