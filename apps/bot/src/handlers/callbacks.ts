import { Bot } from 'grammy';
import {
	getActiveCategories,
	getCategoryById,
	createReport,
	addReportAttachment,
	createReporterTicketMessage
} from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { startReplyFlow } from '../conversations/reply';
import { BotContext } from '../types';
import {
	requireReporter,
	getOwnedTicketForReply,
	resetSession,
	replyTicketStatus,
	promptConfirmReport
} from '../utils/helpers';
import {
	COMMANDS_TEXT,
	categorySelected,
	NO_CATEGORY_MESSAGE,
	reportSuccess,
	REPORT_FAILED,
	WHATS_NEXT,
	CANCEL_MESSAGE,
	ATTACHMENT_PROMPT
} from '../utils/messages';
import { buildCategoryKeyboard, buildPostSubmitKeyboard, doneKeyboard } from '../utils/keyboards';

export function registerCallbacks(bot: Bot<BotContext>): void {
	bot.callbackQuery(/^category_(.+)$/, async (ctx) => {
		const categoryId = ctx.match[1];
		const session = ctx.session;

		const category = await getCategoryById(categoryId);
		session.categoryId = categoryId;
		session.categoryName = category?.name ?? 'Unknown';
		session.step = 'attachment';

		await ctx.answerCallbackQuery();
		await ctx.reply(categorySelected(session.categoryName), {
			reply_markup: doneKeyboard
		});
		await ctx.reply(ATTACHMENT_PROMPT, {
			reply_markup: doneKeyboard
		});
	});

	bot.callbackQuery('cancel_category', async (ctx) => {
		const session = ctx.session;
		resetSession(session);
		await ctx.answerCallbackQuery();
		await ctx.editMessageText(CANCEL_MESSAGE);
		await ctx.reply(CANCEL_MESSAGE, { reply_markup: { remove_keyboard: true } });
	});

	bot.callbackQuery('skip_attachment', async (ctx) => {
		await ctx.answerCallbackQuery();
		await promptConfirmReport(ctx);
	});

	bot.callbackQuery('confirm_report', async (ctx) => {
		const session = ctx.session;

		try {
			const { id: reportId, ticketCode } = await createReport({
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
			await ctx.editMessageText('✅ Laporan terkirim');
			await ctx.reply(reportSuccess(ticketCode), {
				reply_markup: { remove_keyboard: true }
			});
			await ctx.reply(WHATS_NEXT, {
				reply_markup: buildPostSubmitKeyboard(ticketCode)
			});

			resetSession(session);
		} catch (e) {
			await ctx.answerCallbackQuery();
			await ctx.editMessageText(REPORT_FAILED);
		}
	});

	bot.callbackQuery('cancel_report', async (ctx) => {
		const session = ctx.session;

		await ctx.answerCallbackQuery();
		await ctx.editMessageText(CANCEL_MESSAGE);
		await ctx.reply(CANCEL_MESSAGE, { reply_markup: { remove_keyboard: true } });

		resetSession(session);
	});

	bot.callbackQuery('select_category', async (ctx) => {
		const categories = await getActiveCategories();

		await ctx.answerCallbackQuery();
		await ctx.editMessageText('Pilih kategori laporan:', {
			reply_markup: buildCategoryKeyboard(categories)
		});
	});

	bot.callbackQuery('new_report', async (ctx) => {
		await ctx.answerCallbackQuery();

		const reporterId = await requireReporter(ctx, true);
		if (!reporterId) return;

		await startReportFlow(ctx, reporterId);
	});

	bot.callbackQuery('show_commands', async (ctx) => {
		await ctx.answerCallbackQuery();
		await ctx.reply(COMMANDS_TEXT);
	});

	bot.callbackQuery(/^status_(.+)$/, async (ctx) => {
		const ticketCode = ctx.match[1];
		await ctx.answerCallbackQuery();
		await replyTicketStatus(ctx, ticketCode);
	});

	bot.callbackQuery(/^reply_(.+)$/, async (ctx) => {
		const ticketCode = ctx.match[1];
		const owned = await getOwnedTicketForReply(ctx, ticketCode);
		await ctx.answerCallbackQuery();
		if (!owned) return;

		ctx.session.reporterId = owned.reporterId;
		await startReplyFlow(ctx, owned.ticket.id, owned.ticket.ticketCode);
	});

	bot.callbackQuery('confirm_reply', async (ctx) => {
		const session = ctx.session;
		if (!session.replyTicketId || !session.replyBody || !session.reporterId) {
			await ctx.answerCallbackQuery({ text: 'Sesi balasan tidak ditemukan.' });
			return;
		}

		try {
			await createReporterTicketMessage({
				reportId: session.replyTicketId,
				senderReporterId: session.reporterId,
				body: session.replyBody
			});
			await ctx.answerCallbackQuery({ text: 'Balasan terkirim.' });
			await ctx.editMessageText('✅ Balasan berhasil dikirim ke tim IT.');
			resetSession(session);
		} catch (error) {
			console.error('Failed to create reporter reply:', error);
			await ctx.answerCallbackQuery({ text: 'Gagal mengirim balasan.' });
			await ctx.editMessageText('❌ Balasan gagal dikirim. Silakan coba lagi.');
		}
	});

	bot.callbackQuery('cancel_reply', async (ctx) => {
		resetSession(ctx.session);
		await ctx.answerCallbackQuery();
		await ctx.editMessageText('🚫 Balasan dibatalkan.');
	});
}
