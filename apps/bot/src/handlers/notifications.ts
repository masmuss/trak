import { Bot } from 'grammy';
import { listen } from '@trak/database';
import { getPendingNotifications, markNotificationRead } from '@trak/services';
import { BotContext } from '../types';

export async function startNotificationListener(bot: Bot<BotContext>) {
	const pending = await getPendingNotifications();
	for (const n of pending) {
		try {
			await bot.api.sendMessage(Number(n.reporterTelegramId), n.message);
			await markNotificationRead(n.id);
		} catch (e) {
			console.error(`Failed to send pending notification ${n.id}:`, e);
		}
	}

	const meta = await listen('notifications', async (payload: string) => {
		try {
			const data = JSON.parse(payload);
			await bot.api.sendMessage(data.reporterTelegramId, data.message);
			await markNotificationRead(data.notificationId);
		} catch (e) {
			console.error('Failed to process notification:', e);
		}
	});

	process.on('SIGTERM', async () => {
		await meta.unlisten();
		process.exit(0);
	});

	process.on('SIGINT', async () => {
		await meta.unlisten();
		process.exit(0);
	});
}
