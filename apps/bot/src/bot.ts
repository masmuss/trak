import { Bot, session } from 'grammy';
import { config } from './config';
import { registerCommands } from './handlers/commands';
import { registerCallbacks } from './handlers/callbacks';
import { handleTitleInput, handleBodyInput } from './conversations/report';
import { processTelegramFile } from './utils/uploader';
import { BotContext, BotSession } from './types';

const bot = new Bot<BotContext>(config.botToken);

bot.use(
	session({
		initial: (): BotSession => ({
			attachments: []
		})
	})
);

registerCommands(bot);
registerCallbacks(bot);

bot.hears(/^(\/cancel|❌ Batal)$/, async (ctx) => {
	const session = ctx.session;
	Object.assign(session, {
		step: undefined,
		reporterId: undefined,
		title: undefined,
		body: undefined,
		categoryId: undefined,
		categoryName: undefined,
		attachments: []
	});
	await ctx.reply('🚫 Laporan dibatalkan.', { reply_markup: { remove_keyboard: true } });
});

bot.hears(/^(\/done|✅ Selesai|⏭️ Skip)$/, async (ctx) => {
	const session = ctx.session;
	const categoryName = session.categoryName ?? 'Tidak ada';

	const attachmentCount =
		session.attachments.length > 0 ? `${session.attachments.length} file(s)` : 'Tidak ada';

	const confirmation =
		`Ringkasan Laporan:\n\n` +
		`Judul: ${session.title}\n` +
		`Deskripsi: ${session.body}\n` +
		`Kategori: ${categoryName}\n` +
		`Lampiran: ${attachmentCount}\n\n` +
		`Kirim laporan ini?`;

	await ctx.reply(confirmation, {
		reply_markup: {
			remove_keyboard: true
		}
	});

	await ctx.reply('Pilih aksi:', {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: 'Ya, kirim', callback_data: 'confirm_report' },
					{ text: 'Batal', callback_data: 'cancel_report' }
				]
			]
		}
	});
});

bot.on('message:text', async (ctx) => {
	const session = ctx.session;
	if (!session.step) return;

	if (session.step === 'title') {
		await handleTitleInput(ctx, session);
	} else if (session.step === 'body') {
		await handleBodyInput(ctx, session);
	} else {
		await ctx.reply('Saya tidak mengerti. Silakan gunakan tombol atau perintah yang tersedia.');
	}
});

bot.on('message:photo', async (ctx) => {
	const session = ctx.session;
	if (session.step !== 'attachment') return;

	const photo = ctx.message.photo.at(-1);
	if (!photo) return;

	const fileInfo = await processTelegramFile(bot, photo.file_id, 'image/jpeg');

	session.attachments.push(fileInfo);

	await ctx.reply(
		`📎 Gambar diterima. Total lampiran: ${session.attachments.length}\nKirim lagi atau ketik "/done" untuk selesai.`
	);
});

bot.on('message:document', async (ctx) => {
	const session = ctx.session;
	if (session.step !== 'attachment') return;

	const doc = ctx.message.document;
	if (!doc) return;

	const fileInfo = await processTelegramFile(
		bot,
		doc.file_id,
		doc.mime_type ?? 'application/octet-stream'
	);

	session.attachments.push(fileInfo);

	await ctx.reply(
		`📎 Dokumen diterima. Total lampiran: ${session.attachments.length}\nKirim lagi atau ketik "/done" untuk selesai.`
	);
});

bot.api.setMyCommands([
	{ command: 'start', description: 'Mulai dan daftarkan diri' },
	{ command: 'report', description: 'Buat laporan baru' },
	{ command: 'help', description: 'Bantuan' }
]);

bot.catch((err) => {
	console.error('Bot error:', err);
});

bot.start();
