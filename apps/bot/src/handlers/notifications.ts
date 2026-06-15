import { Bot } from 'grammy';
import { listen } from '@trak/database';
import { getPendingNotifications, markNotificationRead } from '@trak/services';
import { BotContext } from '../types';

async function sendAndMark(
	bot: Bot<BotContext>,
	telegramId: bigint | string | number,
	message: string,
	notificationId: string
): Promise<void> {
	try {
		await bot.api.sendMessage(Number(telegramId), message);
		await markNotificationRead(notificationId);
	} catch (e) {
		console.error(`Failed to send pending notification ${notificationId}:`, e);
	}
}

export async function startNotificationListener(bot: Bot<BotContext>) {
	const pending = await getPendingNotifications();
	for (const n of pending) {
		await sendAndMark(bot, n.reporterTelegramId, n.message, n.id);
	}

	const meta = await listen('notifications', async (payload: string) => {
		try {
			const data = JSON.parse(payload);
			await sendAndMark(bot, data.reporterTelegramId, data.message, data.notificationId);
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
