import { describe, expect, it } from 'vitest';
import {
	createAgentNotification,
	createNotification,
	getAgentNotifications,
	getPendingNotifications,
	getUnreadAgentNotificationCount,
	markAgentNotificationRead,
	markNotificationRead
} from '../notification.service';
import { createTestReporter, createTestTicket, createTestUser } from './helpers';

describe('reporter notifications', () => {
	it('queues a pending notification and clears it on read', async () => {
		const reporter = await createTestReporter();
		const ticket = await createTestTicket(reporter.id);

		await createNotification({
			reporterTelegramId: reporter.telegramId,
			reportId: ticket.id,
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
});
