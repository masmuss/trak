import { Bot, session } from 'grammy';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { config } from './config';
import { registerCommands } from './handlers/commands';
import { registerCallbacks } from './handlers/callbacks';
import { handleTitleInput, handleBodyInput } from './conversations/report';
import { processTelegramFile } from './utils/uploader';
import {
	validateInviteCode,
	createReporter,
	getReporterByTelegramId,
	getPendingNotifications,
	markNotificationRead
} from '@trak/services';
import { BotContext, BotSession } from './types';

const sessionDir = join(process.cwd(), '.bot-sessions');
if (!existsSync(sessionDir)) {
	mkdirSync(sessionDir, { recursive: true });
}

const fileAdapter = {
	read: async (key: string) => {
		const filePath = join(sessionDir, `${key}.json`);
		if (!existsSync(filePath)) return undefined;
		return JSON.parse(readFileSync(filePath, 'utf-8'));
	},
	write: async (key: string, value: BotSession) => {
		const filePath = join(sessionDir, `${key}.json`);
		writeFileSync(filePath, JSON.stringify(value), 'utf-8');
	},
	delete: async (key: string) => {
		const filePath = join(sessionDir, `${key}.json`);
		if (existsSync(filePath)) {
			unlinkSync(filePath);
		}
	}
};

const bot = new Bot<BotContext>(config.botToken);

bot.use(
	session({
		initial: (): BotSession => ({
			attachments: []
		}),
		storage: fileAdapter
	})
);

registerCommands(bot);
registerCallbacks(bot);

bot.hears(/^(\/cancel|❌ Batal)$/, async (ctx) => {
	const s = ctx.session;
	Object.assign(s, {
		step: undefined,
		reporterId: undefined,
		title: undefined,
		body: undefined,
		categoryId: undefined,
		categoryName: undefined,
		inviteCode: undefined,
		attachments: []
	});
	await ctx.reply('🚫 Laporan dibatalkan.', { reply_markup: { remove_keyboard: true } });
});

bot.hears(/^(\/done|✅ Selesai|⏭️ Skip)$/, async (ctx) => {
	const s = ctx.session;
	const categoryName = s.categoryName ?? 'Tidak ada';

	const attachmentCount =
		s.attachments.length > 0 ? `${s.attachments.length} file(s)` : 'Tidak ada';

	const confirmation =
		`Ringkasan Laporan:\n\n` +
		`Judul: ${s.title}\n` +
		`Deskripsi: ${s.body}\n` +
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
	const s = ctx.session;
	if (!s.step) return;

	if (s.step === 'awaiting_invite') {
		const code = ctx.message.text.trim();

		const validation = await validateInviteCode(code);

		if (!validation.valid) {
			await ctx.reply(
				`Kode undangan "${code}" tidak valid atau sudah kadaluwarsa.\n\nSilakan coba lagi dengan kode yang benar.`
			);
			return;
		}

		const from = ctx.from!;
		const telegramId = BigInt(from.id);

		await createReporter({
			telegramId,
			username: from.username ?? null,
			fullName: `${from.first_name} ${from.last_name ?? ''}`.trim(),
			inviteCodeId: validation.inviteCodeId!
		});

		const reporter = await getReporterByTelegramId(telegramId);

		s.step = undefined;
		s.reporterId = reporter?.id;

		await ctx.reply(
			`✅ Registrasi berhasil! Selamat datang, ${reporter?.fullName ?? from.first_name}!\n\n` +
				'Sistem Pelaporan Tiket\n\n' +
				'Perintah:\n' +
				'/report - Buat laporan baru\n' +
				'/status - Cek status tiket\n' +
				'/help - Bantuan',
			{ reply_markup: { remove_keyboard: true } }
		);
		return;
	}

	if (s.step === 'title') {
		await handleTitleInput(ctx, s);
	} else if (s.step === 'body') {
		await handleBodyInput(ctx, s);
	} else {
		await ctx.reply('Saya tidak mengerti. Silakan gunakan tombol atau perintah yang tersedia.');
	}
});

bot.on('message:photo', async (ctx) => {
	const s = ctx.session;
	if (s.step !== 'attachment') return;

	const photo = ctx.message.photo.at(-1);
	if (!photo) return;

	const fileInfo = await processTelegramFile(bot, photo.file_id, 'image/jpeg');

	s.attachments.push(fileInfo);

	await ctx.reply(
		`📎 Gambar diterima. Total lampiran: ${s.attachments.length}\nKirim lagi atau ketik "/done" untuk selesai.`
	);
});

bot.on('message:document', async (ctx) => {
	const s = ctx.session;
	if (s.step !== 'attachment') return;

	const doc = ctx.message.document;
	if (!doc) return;

	const fileInfo = await processTelegramFile(
		bot,
		doc.file_id,
		doc.mime_type ?? 'application/octet-stream'
	);

	s.attachments.push(fileInfo);

	await ctx.reply(
		`📎 Dokumen diterima. Total lampiran: ${s.attachments.length}\nKirim lagi atau ketik "/done" untuk selesai.`
	);
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

setInterval(async () => {
	try {
		const pending = await getPendingNotifications();
		for (const n of pending) {
			try {
				await bot.api.sendMessage(Number(n.reporterTelegramId), n.message);
				await markNotificationRead(n.id);
			} catch (e) {
				console.error(`Failed to send notification ${n.id}:`, e);
			}
		}
	} catch (e) {
		console.error('Notification polling error:', e);
	}
}, 5000);

bot.start();
