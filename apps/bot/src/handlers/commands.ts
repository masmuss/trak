import { Bot, Keyboard } from 'grammy';
import {
	getReporterByTelegramId,
	createReporter,
	validateInviteCode,
	getTicketByTicketCode
} from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { BotContext } from '../types';

export function registerCommands(bot: Bot<BotContext>): void {
	bot.command('start', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		const telegramId = BigInt(from.id);

		const existing = await getReporterByTelegramId(telegramId);

		if (existing) {
			await ctx.reply(
				`Selamat datang kembali, ${existing.fullName}!\n\n` +
					'Sistem Pelaporan Tiket\n\n' +
					'Perintah:\n' +
					'/report - Buat laporan baru\n' +
					'/status - Cek status tiket\n' +
					'/help - Bantuan',
				{ reply_markup: { remove_keyboard: true } }
			);
			return;
		}

		ctx.session.step = 'awaiting_invite';
		ctx.session.attachments = [];

		await ctx.reply(
			'Selamat datang di Sistem Pelaporan Tiket!\n\n' +
				'Untuk mendaftar, silakan masukkan kode undangan (invite code) Anda.',
			{
				reply_markup: {
					remove_keyboard: true
				}
			}
		);
	});

	bot.command('help', async (ctx) => {
		await ctx.reply(
			'Bantuan Bot Pelaporan:\n\n' +
				'/start - Mulai dan daftarkan diri\n' +
				'/report - Buat laporan baru\n' +
				'/status - Cek status tiket berdasarkan nomor\n' +
				'/help - Tampilkan bantuan ini\n\n' +
				'Setelah memulai laporan, ikuti petunjuk yang diberikan.'
		);
	});

	bot.command('status', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		const telegramId = BigInt(from.id);
		const reporter = await getReporterByTelegramId(telegramId);

		if (!reporter) {
			await ctx.reply(
				'Anda belum terdaftar. Silakan kirim /start untuk mendaftar terlebih dahulu.'
			);
			return;
		}

		const text = ctx.message?.text?.trim();
		const parts = text?.split(' ');
		const ticketCode = parts?.[1]?.toUpperCase();

		if (!ticketCode) {
			await ctx.reply('Gunakan: /status <nomor tiket>\n\nContoh: /status TKT-ABC12345');
			return;
		}

		const ticket = await getTicketByTicketCode(ticketCode);

		if (!ticket) {
			await ctx.reply(`Tiket ${ticketCode} tidak ditemukan.`);
			return;
		}

		const statusMap: Record<string, string> = {
			open: '🔴 Open',
			in_progress: '🟡 In Progress',
			resolved: '🟢 Resolved',
			closed: '⚪ Closed'
		};

		await ctx.reply(
			`📋 Informasi Tiket ${ticketCode}\n\n` +
				`Judul: ${ticket.title}\n` +
				`Status: ${statusMap[ticket.status] ?? ticket.status}\n` +
				`Kategori: ${ticket.category?.name ?? '-'}\n` +
				`Dibuat: ${ticket.createdAt.toLocaleString('id-ID')}`
		);
	});

	bot.command('report', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		const telegramId = BigInt(from.id);
		const reporter = await getReporterByTelegramId(telegramId);

		if (!reporter) {
			await ctx.reply(
				'Anda belum terdaftar. Silakan kirim /start untuk mendaftar terlebih dahulu.'
			);
			return;
		}

		await startReportFlow(ctx, reporter.id);
	});
}
