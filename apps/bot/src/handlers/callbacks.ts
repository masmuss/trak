import { Bot } from 'grammy';
import {
	getActiveCategories,
	getCategoryById,
	submitReportWithAttachments,
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
	STATIC_CALLBACK,
	parseCategoryCallback,
	parseReplyCallback,
	parseStatusCallback
} from '../utils/callbacks';
import {
	COMMANDS_TEXT,
	categorySelected,
	reportSuccess,
	REPORT_FAILED,
	WHATS_NEXT,
	CANCEL_MESSAGE,
	ATTACHMENT_PROMPT
} from '../utils/messages';
import { buildCategoryKeyboard, buildPostSubmitKeyboard, doneKeyboard } from '../utils/keyboards';

export function registerCallbacks(bot: Bot<BotContext>): void {
	bot.callbackQuery(Object.values(STATIC_CALLBACK), async (ctx) => {
		await routeStaticCallback(ctx, ctx.callbackQuery.data);
	});

	bot.callbackQuery(/^(category|status|reply)_.+$/, async (ctx) => {
		const data = ctx.callbackQuery.data;
		const categoryId = parseCategoryCallback(data);
		if (categoryId) {
			await handleCategorySelected(ctx, categoryId);
			return;
		}
		const statusCode = parseStatusCallback(data);
		if (statusCode) {
			await ctx.answerCallbackQuery();
			await replyTicketStatus(ctx, statusCode);
			return;
		}
		const replyCode = parseReplyCallback(data);
		if (replyCode) {
			await handleReplyRequested(ctx, replyCode);
		}
	});
}

async function routeStaticCallback(ctx: BotContext, data: string): Promise<void> {
	switch (data) {
		case STATIC_CALLBACK.CANCEL_CATEGORY: {
			const session = ctx.session;
			resetSession(session);
			await ctx.answerCallbackQuery();
			await ctx.editMessageText(CANCEL_MESSAGE);
			await ctx.reply(CANCEL_MESSAGE, { reply_markup: { remove_keyboard: true } });
			break;
		}
		case STATIC_CALLBACK.SKIP_ATTACHMENT:
			await ctx.answerCallbackQuery();
			await promptConfirmReport(ctx);
			break;
		case STATIC_CALLBACK.CONFIRM_REPORT:
			await handleConfirmReport(ctx);
			break;
		case STATIC_CALLBACK.CANCEL_REPORT: {
			const session = ctx.session;
			await ctx.answerCallbackQuery();
			await ctx.editMessageText(CANCEL_MESSAGE);
			await ctx.reply(CANCEL_MESSAGE, { reply_markup: { remove_keyboard: true } });
			resetSession(session);
			break;
		}
		case STATIC_CALLBACK.SELECT_CATEGORY: {
			const categories = await getActiveCategories();
			await ctx.answerCallbackQuery();
			await ctx.editMessageText('Pilih kategori laporan:', {
				reply_markup: buildCategoryKeyboard(categories)
			});
			break;
		}
		case STATIC_CALLBACK.NEW_REPORT: {
			await ctx.answerCallbackQuery();
			const reporterId = await requireReporter(ctx, true);
			if (!reporterId) return;
			await startReportFlow(ctx, reporterId);
			break;
		}
		case STATIC_CALLBACK.SHOW_COMMANDS:
			await ctx.answerCallbackQuery();
			await ctx.reply(COMMANDS_TEXT);
			break;
		case STATIC_CALLBACK.CONFIRM_REPLY:
			await handleConfirmReply(ctx);
			break;
		case STATIC_CALLBACK.REPLY_ATTACHMENT: {
			if (ctx.session.step !== 'reply_body' || !ctx.session.replyBody) {
				await ctx.answerCallbackQuery({ text: 'Tulis pesan terlebih dahulu.' });
				return;
			}
			ctx.session.step = 'reply_attachment';
			await ctx.answerCallbackQuery();
			await ctx.reply('Kirim foto atau dokumen yang ingin dilampirkan, lalu gunakan /done.');
			break;
		}
		case STATIC_CALLBACK.CANCEL_REPLY:
			resetSession(ctx.session);
			await ctx.answerCallbackQuery();
			await ctx.editMessageText('🚫 Balasan dibatalkan.');
			break;
	}
}

async function handleCategorySelected(ctx: BotContext, categoryId: string): Promise<void> {
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
}

async function handleReplyRequested(ctx: BotContext, ticketCode: string): Promise<void> {
	const owned = await getOwnedTicketForReply(ctx, ticketCode);
	await ctx.answerCallbackQuery();
	if (!owned) return;

	ctx.session.reporterId = owned.reporterId;
	await startReplyFlow(ctx, owned.ticket.id, owned.ticket.ticketCode);
}

async function handleConfirmReport(ctx: BotContext): Promise<void> {
	const session = ctx.session;

	try {
		const { ticketCode } = await submitReportWithAttachments({
			reporterId: session.reporterId!,
			categoryId: session.categoryId,
			title: session.title!,
			body: session.body!,
			attachments: session.attachments
		});

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
}

async function handleConfirmReply(ctx: BotContext): Promise<void> {
	const session = ctx.session;
	if (!session.replyTicketId || !session.replyBody || !session.reporterId) {
		await ctx.answerCallbackQuery({ text: 'Sesi balasan tidak ditemukan.' });
		return;
	}

	try {
		await createReporterTicketMessage({
			reportId: session.replyTicketId,
			senderReporterId: session.reporterId,
			body: session.replyBody,
			attachments: session.attachments
		});
		await ctx.answerCallbackQuery({ text: 'Balasan terkirim.' });
		await ctx.editMessageText('✅ Balasan berhasil dikirim ke tim IT.');
		resetSession(session);
	} catch (error) {
		console.error('Failed to create reporter reply:', error);
		await ctx.answerCallbackQuery({ text: 'Gagal mengirim balasan.' });
		await ctx.editMessageText('❌ Balasan gagal dikirim. Silakan coba lagi.');
	}
}
