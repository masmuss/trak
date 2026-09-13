import {
	getReporterByTelegramId,
	getTicketByTicketCode,
	getTicketByTicketCodeForReporter
} from '@trak/services';
import { BotContext, BotSession } from '../types';
import { formatTicketStatusMessage } from '../presenters/ticket-status';
import {
	NO_REPORTER_SHORT,
	NO_REPORTER_MESSAGE,
	ticketNotFound,
	buildReportSummary
} from './messages';
import { buildConfirmKeyboard, buildTicketStatusKeyboard } from './keyboards';

export async function requireReporter(ctx: BotContext, short = false): Promise<string | null> {
	const from = ctx.from;
	if (!from) return null;

	const telegramId = BigInt(from.id);
	const reporter = await getReporterByTelegramId(telegramId);

	if (!reporter) {
		await ctx.reply(short ? NO_REPORTER_SHORT : NO_REPORTER_MESSAGE);
		return null;
	}

	return reporter.id;
}

export function resetSession(session: BotSession): void {
	Object.assign(session, {
		step: undefined,
		reporterId: undefined,
		title: undefined,
		body: undefined,
		categoryId: undefined,
		categoryName: undefined,
		inviteCode: undefined,
		replyTicketId: undefined,
		replyTicketCode: undefined,
		replyBody: undefined,
		attachments: []
	});
}

export function getAttachmentSummary(attachments: BotSession['attachments']): string {
	return attachments.length > 0 ? `${attachments.length} file(s)` : 'Tidak ada';
}

export async function promptConfirmReport(ctx: BotContext): Promise<void> {
	const s = ctx.session;
	const summary = buildReportSummary({
		title: s.title,
		body: s.body,
		categoryName: s.categoryName,
		attachmentSummary: getAttachmentSummary(s.attachments)
	});
	await ctx.reply(summary, { reply_markup: buildConfirmKeyboard() });
}

export async function replyTicketStatus(ctx: BotContext, ticketCode: string): Promise<void> {
	const ticket = await getTicketByTicketCode(ticketCode);

	if (!ticket) {
		await ctx.reply(ticketNotFound(ticketCode));
		return;
	}

	await ctx.reply(formatTicketStatusMessage(ticketCode, ticket));

	const reporter = ctx.from ? await getReporterByTelegramId(BigInt(ctx.from.id)) : undefined;
	if (reporter?.id === ticket.reporterId) {
		await ctx.reply('Pilih tindakan untuk ticket ini:', {
			reply_markup: buildTicketStatusKeyboard(ticket.ticketCode, ticket.status !== 'closed')
		});
	}
}

export async function getOwnedTicketForReply(ctx: BotContext, ticketCode: string) {
	const reporterId = await requireReporter(ctx, true);
	if (!reporterId) return null;

	const ticket = await getTicketByTicketCodeForReporter(ticketCode, reporterId);
	if (!ticket) {
		await ctx.reply(ticketNotFound(ticketCode));
		return null;
	}

	if (ticket.status === 'closed') {
		await ctx.reply('Ticket ini sudah ditutup dan tidak dapat menerima balasan baru.');
		return null;
	}

	return { reporterId, ticket };
}
