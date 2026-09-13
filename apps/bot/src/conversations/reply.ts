import { MAX_MESSAGE_LENGTH } from '@trak/shared';
import { BotContext } from '../types';
import { STATIC_CALLBACK } from '../utils/callbacks';

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
	session.attachments = [];

	await ctx.reply(`💬 Balas ticket ${ticketCode}\n\nTuliskan pesan untuk tim IT.`);
}

export async function handleReplyBodyInput(ctx: BotContext): Promise<void> {
	const body = ctx.message?.text?.trim();
	if (!body) return;

	if (body.length > MAX_MESSAGE_LENGTH) {
		await ctx.reply(`Pesan terlalu panjang. Maksimal ${MAX_MESSAGE_LENGTH} karakter.`);
		return;
	}

	ctx.session.replyBody = body;
	await ctx.reply(`Pesan balasan:\n\n${body}\n\nKirim balasan ini?`, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: '✅ Kirim', callback_data: STATIC_CALLBACK.CONFIRM_REPLY },
					{ text: '📎 Tambah lampiran', callback_data: STATIC_CALLBACK.REPLY_ATTACHMENT },
					{ text: '❌ Batal', callback_data: STATIC_CALLBACK.CANCEL_REPLY }
				]
			]
		}
	});
}

export async function promptReplyConfirmation(ctx: BotContext): Promise<void> {
	const { replyBody, attachments } = ctx.session;
	if (!replyBody) {
		await ctx.reply('Tulis pesan balasan terlebih dahulu.');
		return;
	}

	const attachmentSummary = attachments.length ? `\nLampiran: ${attachments.length} file` : '';
	await ctx.reply(`Pesan balasan:\n\n${replyBody}${attachmentSummary}\n\nKirim balasan ini?`, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: '✅ Kirim', callback_data: STATIC_CALLBACK.CONFIRM_REPLY },
					{ text: '❌ Batal', callback_data: STATIC_CALLBACK.CANCEL_REPLY }
				]
			]
		}
	});
}
