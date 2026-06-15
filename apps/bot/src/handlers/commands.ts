import { Bot } from 'grammy';
import { getReporterByTelegramId, getTicketByTicketCode } from '@trak/services';
import { startReportFlow } from '../conversations/report';
import { BotContext } from '../types';
import { requireReporter } from '../utils/helpers';
import {
	STATUS_LABEL,
	HELP_TEXT,
	welcomeBack,
	WELCOME_NEW,
	registrationSuccess,
	statusUsage,
	ticketNotFound
} from '../utils/messages';
import { removeKeyboard } from '../utils/keyboards';

export function registerCommands(bot: Bot<BotContext>): void {
	bot.command('start', async (ctx) => {
		const from = ctx.from;
		if (!from) return;

		const telegramId = BigInt(from.id);
		const existing = await getReporterByTelegramId(telegramId);

		if (existing) {
			await ctx.reply(welcomeBack(existing.fullName), {
				reply_markup: removeKeyboard
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

		const ticket = await getTicketByTicketCode(ticketCode);

		if (!ticket) {
			await ctx.reply(ticketNotFound(ticketCode));
			return;
		}

		const history =
			ticket.statusHistories.length > 0
				? '\n\nRiwayat Status:\n' +
					ticket.statusHistories
						.map(
							(h) =>
								`${h.changedAt.toLocaleString('id-ID')} — ${STATUS_LABEL[h.oldStatus] ?? h.oldStatus} → ${STATUS_LABEL[h.newStatus] ?? h.newStatus}` +
								(h.note ? ` (${h.note})` : '') +
								` oleh ${h.changedByUser.name}`
						)
						.join('\n')
				: '';

		await ctx.reply(
			`📋 Tiket ${ticketCode}\n\n` +
				`${ticket.title}\n\n` +
				`${ticket.body}\n\n` +
				`Status: ${STATUS_LABEL[ticket.status] ?? ticket.status}` +
				` | Kategori: ${ticket.category?.name ?? '-'}` +
				` | Lampiran: ${ticket.attachments.length}` +
				`\nDibuat: ${ticket.createdAt.toLocaleString('id-ID')}` +
				(ticket.updatedAt ? `\nDiperbarui: ${ticket.updatedAt.toLocaleString('id-ID')}` : '') +
				history
		);
	});

	bot.command('report', async (ctx) => {
		const reporterId = await requireReporter(ctx);
		if (!reporterId) return;

		await startReportFlow(ctx, reporterId);
	});
}
