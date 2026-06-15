import { Bot } from 'grammy';
import { BotContext } from '../types';
import { processTelegramFile } from '../utils/uploader';
import { attachmentReceived } from '../utils/messages';

export function registerAttachmentHandlers(bot: Bot<BotContext>): void {
	bot.on('message:photo', async (ctx) => {
		const s = ctx.session;
		if (s.step !== 'attachment') return;

		const photo = ctx.message.photo.at(-1);
		if (!photo) return;

		const fileInfo = await processTelegramFile(bot, photo.file_id, 'image/jpeg');
		s.attachments.push(fileInfo);

		await ctx.reply(attachmentReceived(s.attachments.length));
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

		await ctx.reply(attachmentReceived(s.attachments.length));
	});
}
