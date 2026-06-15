import { getActiveCategories } from '@trak/services';
import { BotContext } from '../types';
import { cancelKeyboard, doneKeyboard, buildCategoryKeyboard } from '../utils/keyboards';
import {
	reportStepTitle,
	reportStepBody,
	reportStepCategory,
	noCategoriesMessage
} from '../utils/messages';

export async function startReportFlow(ctx: BotContext, reporterId: string): Promise<void> {
	const session = ctx.session;

	session.step = 'title';
	session.reporterId = reporterId;
	session.attachments = [];

	await ctx.reply(reportStepTitle(), {
		reply_markup: cancelKeyboard
	});
}

export async function handleTitleInput(ctx: BotContext): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;

	const session = ctx.session;
	session.title = ctx.message.text.trim();
	session.step = 'body';

	await ctx.reply(reportStepBody(), {
		reply_markup: cancelKeyboard
	});
}

export async function handleBodyInput(ctx: BotContext): Promise<void> {
	if (!ctx.message || !ctx.message.text) return;

	const session = ctx.session;
	session.body = ctx.message.text.trim();

	const categories = await getActiveCategories();

	if (categories.length === 0) {
		session.step = 'attachment';
		await ctx.reply(noCategoriesMessage(), {
			reply_markup: doneKeyboard
		});
		return;
	}

	session.step = 'category';

	await ctx.reply(reportStepCategory(), {
		reply_markup: buildCategoryKeyboard(categories)
	});
}
