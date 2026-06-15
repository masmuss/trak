import { getReporterByTelegramId, getTicketByTicketCode } from '@trak/services';
import { BotContext, BotSession } from '../types';
import { NO_REPORTER_SHORT, NO_REPORTER_MESSAGE, STATUS_LABEL, ticketNotFound } from './messages';

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
		attachments: []
	});
}

export function getAttachmentSummary(attachments: BotSession['attachments']): string {
	return attachments.length > 0 ? `${attachments.length} file(s)` : 'Tidak ada';
}

export async function replyTicketStatus(ctx: BotContext, ticketCode: string): Promise<void> {
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
}
