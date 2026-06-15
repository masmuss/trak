import { validateInviteCode, createReporter, getReporterByTelegramId } from '@trak/services';
import { BotContext } from '../types';
import { invalidInviteError, registrationSuccess } from '../utils/messages';
import { buildWelcomeKeyboard } from '../utils/keyboards';

export async function handleInviteInput(ctx: BotContext): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;
	const code = ctx.message.text.trim();
	const validation = await validateInviteCode(code);

	if (!validation.valid) {
		await ctx.reply(invalidInviteError(code));
		return;
	}

	const from = ctx.from!;
	const telegramId = BigInt(from.id);

	await createReporter({
		telegramId,
		username: from.username ?? null,
		fullName: `${from.first_name} ${from.last_name ?? ''}`.trim(),
		inviteCodeId: validation.inviteCodeId!
	});

	const reporter = await getReporterByTelegramId(telegramId);

	ctx.session.step = undefined;
	ctx.session.reporterId = reporter?.id;

	await ctx.reply(registrationSuccess(reporter?.fullName ?? '', from.first_name), {
		reply_markup: buildWelcomeKeyboard()
	});
}
