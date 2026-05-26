import { getActiveCategories } from '@trak/services';
import type { Context } from 'grammy';
import { BotContext, BotSession } from '../types';

export async function startReportFlow(ctx: BotContext, reporterId: string): Promise<void> {
	const session = ctx.session;

	session.step = 'title';
	session.reporterId = reporterId;
	session.attachments = [];

	await ctx.reply(
		'Buat Laporan Baru\n\n' +
			'Langkah 1/3: Masukkan judul laporan.\n\n' +
			'Ketik /cancel untuk membatalkan kapan saja.'
	);
}

export async function handleTitleInput(ctx: Context, session: BotSession): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;

	session.title = ctx.message.text.trim();
	session.step = 'body';

	await ctx.reply('Langkah 2/3: Masukkan deskripsi laporan secara detail.');
}

export async function handleBodyInput(ctx: Context, session: BotSession): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;

	session.body = ctx.message.text.trim();

	const categories = await getActiveCategories();

	if (categories.length === 0) {
		session.step = 'attachment';
		await ctx.reply(
			'Tidak ada kategori tersedia.\n\nSekarang kirim lampiran (foto/dokumen) atau ketik "/done" untuk selesai.',
			{
				reply_markup: {
					inline_keyboard: [[{ text: 'Lewati lampiran', callback_data: 'skip_attachment' }]]
				}
			}
		);
		return;
	}

	session.step = 'category';

	const keyboard = categories.map((cat) => [
		{ text: cat.name, callback_data: `category_${cat.id}` }
	]);
	keyboard.push([{ text: 'Lewati', callback_data: 'skip_category' }]);

	await ctx.reply('Langkah 3/3: Pilih kategori laporan:', {
		reply_markup: { inline_keyboard: keyboard }
	});
}
