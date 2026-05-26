import { Context, SessionFlavor } from 'grammy';

export type BotSession = {
	step?: string;
	reporterId?: string;
	title?: string;
	body?: string;
	categoryId?: string;
	categoryName?: string;
	attachments: { fileId: string; fileType: string; storageUrl: string }[];
};

export type BotContext = Context & SessionFlavor<BotSession>;
