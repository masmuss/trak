import { getActiveCategories } from '@trak/services';
import type { Context } from 'grammy';
import { BotContext, BotSession } from '../types';

const cancelKeyboard = {
	keyboard: [[{ text: '❌ Batal' }]],
	resize_keyboard: true,
	one_time_keyboard: true
};

const doneKeyboard = {
	keyboard: [[{ text: '✅ Selesai' }, { text: '⏭️ Skip' }, { text: '❌ Batal' }]],
	resize_keyboard: true,
	one_time_keyboard: true
};

export async function startReportFlow(ctx: BotContext, reporterId: string): Promise<void> {
	const session = ctx.session;

	session.step = 'title';
	session.reporterId = reporterId;
	session.attachments = [];

	await ctx.reply('Buat Laporan Baru\n\nLangkah 1/3: Masukkan judul laporan.', {
		reply_markup: cancelKeyboard
	});
}

export async function handleTitleInput(ctx: Context, session: BotSession): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;

	session.title = ctx.message.text.trim();
	session.step = 'body';

	await ctx.reply('Langkah 2/3: Masukkan deskripsi laporan secara detail.', {
		reply_markup: cancelKeyboard
	});
}

export async function handleBodyInput(ctx: Context, session: BotSession): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;

	session.body = ctx.message.text.trim();

	const categories = await getActiveCategories();

	if (categories.length === 0) {
		session.step = 'attachment';
		await ctx.reply(
			'Tidak ada kategori tersedia.\n\nSekarang kirim lampiran (foto/dokumen) atau gunakan tombol di bawah.',
			{
				reply_markup: doneKeyboard
			}
		);
		return;
	}

	session.step = 'category';

	const inlineKeyboard = categories.map((cat) => [
		{ text: cat.name, callback_data: `category_${cat.id}` }
	]);
	inlineKeyboard.push([{ text: 'Lewati', callback_data: 'skip_category' }]);

	await ctx.reply('Langkah 3/3: Pilih kategori laporan:', {
		reply_markup: { inline_keyboard: inlineKeyboard }
	});
}
