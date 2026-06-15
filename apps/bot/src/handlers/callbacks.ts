import { Bot } from 'grammy';
import {
	getActiveCategories,
	getCategoryById,
	createReport,
	addReportAttachment
} from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { BotContext } from '../types';
import {
	requireReporter,
	resetSession,
	getAttachmentSummary,
	replyTicketStatus
} from '../utils/helpers';
import {
	COMMANDS_TEXT,
	categorySelected,
	NO_CATEGORY_MESSAGE,
	buildReportSummary,
	reportSuccess,
	REPORT_FAILED,
	WHATS_NEXT,
	CANCEL_MESSAGE
} from '../utils/messages';
import {
	buildCategoryKeyboard,
	buildConfirmKeyboard,
	buildSkipAttachmentKeyboard,
	buildPostSubmitKeyboard
} from '../utils/keyboards';

export function registerCallbacks(bot: Bot<BotContext>): void {
	bot.callbackQuery(/^category_(.+)$/, async (ctx) => {
		const categoryId = ctx.match[1];
		const session = ctx.session;

		const category = await getCategoryById(categoryId);
		session.categoryId = categoryId;
		session.categoryName = category?.name ?? 'Unknown';
		session.step = 'attachment';

		await ctx.answerCallbackQuery();
		await ctx.editMessageText(categorySelected(session.categoryName), {
			reply_markup: buildSkipAttachmentKeyboard()
		});
	});

	bot.callbackQuery('skip_category', async (ctx) => {
		const session = ctx.session;
		session.categoryId = undefined;
		session.step = 'attachment';

		await ctx.answerCallbackQuery();
		await ctx.editMessageText(NO_CATEGORY_MESSAGE, {
			reply_markup: buildSkipAttachmentKeyboard()
		});
	});

	bot.callbackQuery('skip_attachment', async (ctx) => {
		const session = ctx.session;

		await ctx.answerCallbackQuery();

		const summary = buildReportSummary({
			title: session.title,
			body: session.body,
			categoryName: session.categoryName,
			attachmentSummary: 'Tidak ada'
		});

		await ctx.editMessageText(summary, {
			reply_markup: buildConfirmKeyboard()
		});
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
			await ctx.editMessageText(reportSuccess(ticketCode));

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
}
