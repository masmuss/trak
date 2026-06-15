import { Bot } from 'grammy';
import { getReporterByTelegramId } from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { BotContext } from '../types';
import { requireReporter, replyTicketStatus } from '../utils/helpers';
import {
	HELP_TEXT,
	welcomeBack,
	WELCOME_NEW,
	registrationSuccess,
	statusUsage
} from '../utils/messages';
import { buildWelcomeKeyboard, removeKeyboard } from '../utils/keyboards';

export function registerCommands(bot: Bot<BotContext>): void {
	bot.command('start', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		const telegramId = BigInt(from.id);
		const existing = await getReporterByTelegramId(telegramId);

		if (existing) {
			await ctx.reply(welcomeBack(existing.fullName), {
				reply_markup: buildWelcomeKeyboard()
			});
			return;
		}

		ctx.session.step = 'awaiting_invite';
		ctx.session.attachments = [];

		await ctx.reply(WELCOME_NEW, {
			reply_markup: removeKeyboard
		});
	});

	bot.command('help', async (ctx) => {
		await ctx.reply(HELP_TEXT);
	});

	bot.command('status', async (ctx) => {
		const reporterId = await requireReporter(ctx);
		if (!reporterId) return;

		const text = ctx.message?.text?.trim();
		const parts = text?.split(' ');
		const ticketCode = parts?.[1]?.toUpperCase();

		if (!ticketCode) {
			await ctx.reply(statusUsage());
			return;
		}

		await replyTicketStatus(ctx, ticketCode);
	});

	bot.command('report', async (ctx) => {
		const reporterId = await requireReporter(ctx);
		if (!reporterId) return;

		await startReportFlow(ctx, reporterId);
	});
}
