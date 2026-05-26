import { Bot } from 'grammy';
import {
	getActiveCategories,
	getCategoryById,
	createReport,
	addReportAttachment,
	getReporterByTelegramId
} from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { generateTicketNumber } from '../utils/generator';
import { BotContext } from '../types';

export function registerCallbacks(bot: Bot<BotContext>): void {
	bot.callbackQuery(/^category_(.+)$/, async (ctx) => {
		const categoryId = ctx.match[1];
		const session = ctx.session;

		const category = await getCategoryById(categoryId);
		session.categoryId = categoryId;
		session.categoryName = category?.name ?? 'Unknown';
		session.step = 'attachment';

		await ctx.answerCallbackQuery();
		await ctx.editMessageText(
			`Kategori dipilih: ${session.categoryName}\n\nSekarang kirim lampiran (foto/dokumen) atau ketik "/done" untuk selesai.`,
			{
				reply_markup: {
					inline_keyboard: [[{ text: 'Lewati lampiran', callback_data: 'skip_attachment' }]]
				}
			}
		);
	});

	bot.callbackQuery('skip_category', async (ctx) => {
		const session = ctx.session;
		session.categoryId = undefined;
		session.step = 'attachment';

		await ctx.answerCallbackQuery();
		await ctx.editMessageText(
			'Laporan tanpa kategori.\n\nSekarang kirim lampiran (foto/dokumen) atau ketik "/done" untuk selesai.',
			{
				reply_markup: {
					inline_keyboard: [[{ text: 'Lewati lampiran', callback_data: 'skip_attachment' }]]
				}
			}
		);
	});

	bot.callbackQuery('skip_attachment', async (ctx) => {
		const session = ctx.session;

		await ctx.answerCallbackQuery();

		const confirmation =
			`Ringkasan Laporan:\n\n` +
			`Judul: ${session.title}\n` +
			`Deskripsi: ${session.body}\n` +
			`Kategori: ${session.categoryName ?? 'Tidak ada'}\n` +
			`Lampiran: Tidak ada\n\n` +
			`Kirim laporan ini?`;

		await ctx.editMessageText(confirmation, {
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

	bot.callbackQuery('confirm_report', async (ctx) => {
		const session = ctx.session;

		try {
			const reportId = await createReport({
				reporterId: session.reporterId!,
				categoryId: session.categoryId,
				title: session.title!,
				body: session.body!
			});

			for (const att of session.attachments) {
				await addReportAttachment({
					reportId,
					fileId: att.fileId,
					fileType: att.fileType,
					storageUrl: att.storageUrl
				});
			}

			await ctx.answerCallbackQuery();
			await ctx.editMessageText(
				`✅ Laporan berhasil dikirim!` +
					`\n\nKode tiket: TKT-${reportId.slice(0, 8).toUpperCase()}` +
					`\n\nTerima kasih, laporan Anda akan segera diproses.`
			);

			await ctx.reply('Apa yang ingin Anda lakukan selanjutnya?', {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: '📝 Buat laporan baru', callback_data: 'new_report' },
							{ text: '📋 Perintah', callback_data: 'show_commands' }
						]
					]
				}
			});

			Object.assign(session, {
				step: undefined,
				reporterId: undefined,
				title: undefined,
				body: undefined,
				categoryId: undefined,
				categoryName: undefined,
				attachments: []
			});
		} catch (e) {
			await ctx.answerCallbackQuery();
			await ctx.editMessageText('❌ Gagal mengirim laporan. Silakan coba lagi.');
		}
	});

	bot.callbackQuery('cancel_report', async (ctx) => {
		const session = ctx.session;

		await ctx.answerCallbackQuery();
		await ctx.editMessageText('🚫 Laporan dibatalkan.');
		await ctx.reply('Laporan dibatalkan.', { reply_markup: { remove_keyboard: true } });

		Object.assign(session, {
			step: undefined,
			reporterId: undefined,
			title: undefined,
			body: undefined,
			categoryId: undefined,
			categoryName: undefined,
			attachments: []
		});
	});

	bot.callbackQuery('select_category', async (ctx) => {
		const categories = await getActiveCategories();
		const keyboard = categories.map((cat) => [
			{ text: cat.name, callback_data: `category_${cat.id}` }
		]);
		keyboard.push([{ text: 'Lewati', callback_data: 'skip_category' }]);

		await ctx.answerCallbackQuery();
		await ctx.editMessageText('Pilih kategori laporan:', {
			reply_markup: { inline_keyboard: keyboard }
		});
	});

	bot.callbackQuery('new_report', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		await ctx.answerCallbackQuery();

		const telegramId = BigInt(from.id);
		const reporter = await getReporterByTelegramId(telegramId);

		if (!reporter) {
			await ctx.reply('Anda belum terdaftar. Silakan kirim /start.');
			return;
		}

		await startReportFlow(ctx, reporter.id);
	});

	bot.callbackQuery('show_commands', async (ctx) => {
		await ctx.answerCallbackQuery();
		await ctx.reply(
			'Perintah yang tersedia:\n\n' +
				'/start - Mulai dan daftarkan diri\n' +
				'/report - Buat laporan baru\n' +
				'/help - Tampilkan bantuan'
		);
	});
}
