import { Bot, session } from 'grammy';
import { createPgSessionAdapter } from '@trak/database';
import { cleanUpStaleSessions } from '@trak/services';
import { config } from './config';
import { registerCommands } from './handlers/commands';
import { registerCallbacks } from './handlers/callbacks';
import { registerAttachmentHandlers } from './handlers/attachments';
import { startNotificationListener } from './handlers/notifications';
import { handleTitleInput, handleBodyInput } from './conversations/report';
import { handleInviteInput } from './conversations/invite';
import { BotContext, BotSession } from './types';
import { resetSession, promptConfirmReport } from './utils/helpers';
import { CANCEL_MESSAGE, IDLE_ERROR_MESSAGE, UNKNOWN_MESSAGE } from './utils/messages';
import { removeKeyboard } from './utils/keyboards';
import nodeCron from 'node-cron';

const bot = new Bot<BotContext>(config.botToken);

bot.use(
	session({
		initial: (): BotSession => ({
			attachments: []
		}),
		storage: createPgSessionAdapter<BotSession>()
	})
);

registerCommands(bot);
registerCallbacks(bot);
registerAttachmentHandlers(bot);

bot.hears(/^(\/cancel|❌ Batal)$/, async (ctx) => {
	resetSession(ctx.session);
	await ctx.reply(CANCEL_MESSAGE, { reply_markup: removeKeyboard });
});

bot.hears(/^(\/selesai|\/done|✅ Selesai)$/, async (ctx) => {
	const s = ctx.session;

	if (!s.step || !s.title || !s.body) {
		await ctx.reply('Tidak ada sesi laporan aktif. Gunakan /report untuk membuat laporan baru.', {
			reply_markup: removeKeyboard
		});
		return;
	}

	await promptConfirmReport(ctx);
});

bot.on('message:text', async (ctx) => {
	const s = ctx.session;
	if (!s.step) return;

	if (s.step === 'idle') {
		await ctx.reply(IDLE_ERROR_MESSAGE);
		return;
	}

	if (s.step === 'awaiting_invite') {
		await handleInviteInput(ctx);
		return;
	}

	if (s.step === 'title') {
		await handleTitleInput(ctx);
	} else if (s.step === 'body') {
		await handleBodyInput(ctx);
	} else {
		await ctx.reply(UNKNOWN_MESSAGE);
	}
});

bot.api.setMyCommands([
	{ command: 'start', description: 'Mulai dan daftarkan diri' },
	{ command: 'report', description: 'Buat laporan baru' },
	{ command: 'status', description: 'Cek status tiket' },
	{ command: 'help', description: 'Bantuan' }
]);

bot.catch((err) => {
	console.error('Bot error:', err);
});

startNotificationListener(bot);

nodeCron.schedule(
	'0 3 * * *',
	async () => {
		console.log('Running daily cleanup of stale sessions...');
		const deletedCount = await cleanUpStaleSessions();
		console.log(`Deleted ${deletedCount} stale sessions.`);
	},
	{
		timezone: 'Asia/Jakarta',
		name: 'Daily Session Cleanup'
	}
);

bot.start();
