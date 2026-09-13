import { BotContext } from '../types';

export async function startReplyFlow(
	ctx: BotContext,
	ticketId: string,
	ticketCode: string
): Promise<void> {
	const session = ctx.session;
	session.step = 'reply_body';
	session.replyTicketId = ticketId;
	session.replyTicketCode = ticketCode;
	session.replyBody = undefined;

	await ctx.reply(`💬 Balas ticket ${ticketCode}\n\nTuliskan pesan untuk tim IT.`);
}

export async function handleReplyBodyInput(ctx: BotContext): Promise<void> {
	const body = ctx.message?.text?.trim();
	if (!body) return;

	if (body.length > 5000) {
		await ctx.reply('Pesan terlalu panjang. Maksimal 5000 karakter.');
		return;
	}

	ctx.session.replyBody = body;
	await ctx.reply(`Pesan balasan:\n\n${body}\n\nKirim balasan ini?`, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: '✅ Kirim', callback_data: 'confirm_reply' },
					{ text: '❌ Batal', callback_data: 'cancel_reply' }
				]
			]
		}
	});
}
