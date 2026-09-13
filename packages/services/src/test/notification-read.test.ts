import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, notifications } from '@trak/database';
import {
	createAgentNotification,
	createNotification,
	getAgentNotifications,
	getPendingNotifications,
	getUnreadAgentNotificationCount,
	markAgentNotificationRead,
	markAllAgentNotificationsRead,
	markNotificationRead,
	purgeReadNotifications
} from '../notification.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

describe('reporter notifications', () => {
	it('queues a pending notification and clears it on read', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await createNotification({
			reporterTelegramId: reporter.telegramId,
			reportId: ticket.id,
			type: 'status_changed',
			message: 'Status tiket diperbarui'
		});

		let pending = await getPendingNotifications();
		expect(pending.some((n) => n.reportId === ticket.id && !n.isRead)).toBe(true);

		const target = pending.find((n) => n.reportId === ticket.id);
		await markNotificationRead(target!.id);

		pending = await getPendingNotifications();
		expect(pending.some((n) => n.id === target!.id)).toBe(false);
	});

	it('is idempotent on double read', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await createNotification({
			reporterTelegramId: reporter.telegramId,
			reportId: ticket.id,
			type: 'agent_reply',
			message: 'Pesan ganda'
		});

		const pending = await getPendingNotifications();
		const target = pending.find((n) => n.reportId === ticket.id);
		await markNotificationRead(target!.id);
		await markNotificationRead(target!.id);

		const again = await getPendingNotifications();
		expect(again.some((n) => n.id === target!.id)).toBe(false);
	});
});

describe('agent notifications', () => {
	it('counts unread and scopes reads to the owner', async () => {
		const owner = await createTestUser('agent');
		const other = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const notification = await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'assignment',
			message: 'Ticket ditugaskan kepada Anda'
		});

		expect(await getUnreadAgentNotificationCount(owner.id)).toBe(1);

		// Another user must not be able to clear someone else's notification.
		await markAgentNotificationRead(notification.id, other.id);
		expect(await getUnreadAgentNotificationCount(owner.id)).toBe(1);

		await markAgentNotificationRead(notification.id, owner.id);
		expect(await getUnreadAgentNotificationCount(owner.id)).toBe(0);

		const list = await getAgentNotifications(owner.id);
		expect(list.find((n) => n.id === notification.id)?.isRead).toBe(true);
	});

	it('dedups re-sent agent notifications on the same key', async () => {
		const owner = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const first = await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'assignment',
			message: 'Ticket ditugaskan kepada Anda',
			dedupKey: `test-dedup-${ticket.id}`
		});
		const second = await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'assignment',
			message: 'Ticket ditugaskan kepada Anda',
			dedupKey: `test-dedup-${ticket.id}`
		});

		expect(second.id).toBe(first.id);
		const list = await getAgentNotifications(owner.id);
		expect(list.filter((n) => n.reportId === ticket.id)).toHaveLength(1);
	});

	it('marks all as read in one call', async () => {
		const owner = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'assignment',
			message: 'Satu'
		});
		await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'reporter_reply',
			message: 'Dua'
		});
		expect(await getUnreadAgentNotificationCount(owner.id)).toBe(2);

		await markAllAgentNotificationsRead(owner.id);
		expect(await getUnreadAgentNotificationCount(owner.id)).toBe(0);
	});

	it('purges old read notifications but keeps unread and fresh ones', async () => {
		const owner = await createTestUser('agent');
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		const oldRead = await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'assignment',
			message: 'Lama dan terbaca'
		});
		await markAgentNotificationRead(oldRead.id, owner.id);
		const fortyDaysAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000);

		const { agentNotifications: agentTable } = await import('@trak/database/schema');
		await db
			.update(agentTable)
			.set({ createdAt: fortyDaysAgo })
			.where(eq(agentTable.id, oldRead.id));

		const freshRead = await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'assignment',
			message: 'Baru tapi terbaca'
		});
		await markAgentNotificationRead(freshRead.id, owner.id);

		const unread = await createAgentNotification({
			recipientUserId: owner.id,
			reportId: ticket.id,
			type: 'reporter_reply',
			message: 'Belum dibaca'
		});

		const purged = await purgeReadNotifications(30);
		expect(purged.agent).toBe(1);

		const remaining = await getAgentNotifications(owner.id);
		expect(remaining.some((n) => n.id === oldRead.id)).toBe(false);
		expect(remaining.some((n) => n.id === freshRead.id)).toBe(true);
		expect(remaining.some((n) => n.id === unread.id)).toBe(true);
	});
});
