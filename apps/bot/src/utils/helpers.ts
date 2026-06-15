import { getReporterByTelegramId } from '@trak/services';
import { BotContext, BotSession } from '../types';
import { NO_REPORTER_SHORT, NO_REPORTER_MESSAGE } from './messages';

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
