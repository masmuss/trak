import { Bot } from 'grammy';
import { getReporterByTelegramId, createReporter } from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { BotContext } from '../types';

export function registerCommands(bot: Bot<BotContext>): void {
	bot.command('start', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		const telegramId = BigInt(from.id);

		let reporter = await getReporterByTelegramId(telegramId);

		if (!reporter) {
			await createReporter({
				telegramId,
				username: from.username ?? null,
				fullName: `${from.first_name} ${from.last_name ?? ''}`.trim(),
				inviteCodeId: null
			});
			reporter = await getReporterByTelegramId(telegramId);
		}

		await ctx.reply(
			`Selamat datang, ${reporter?.fullName ?? from.first_name}!\n\n` +
				'Sistem Pelaporan Tiket\n\n' +
				'Perintah:\n' +
				'/report - Buat laporan baru\n' +
				'/help - Bantuan',
			{ reply_markup: { remove_keyboard: true } }
		);
	});

	bot.command('help', async (ctx) => {
		await ctx.reply(
			'Bantuan Bot Pelaporan:\n\n' +
				'/start - Mulai dan daftarkan diri\n' +
				'/report - Buat laporan baru\n' +
				'/help - Tampilkan bantuan ini\n\n' +
				'Setelah memulai laporan, ikuti petunjuk yang diberikan.'
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
