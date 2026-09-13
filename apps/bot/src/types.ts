import { Context, SessionFlavor } from 'grammy';

export type SessionStep =
	'awaiting_invite' | 'title' | 'body' | 'category' | 'attachment' | 'reply_body' | 'idle';

export type BotSession = {
	step?: SessionStep;
	reporterId?: string;
	title?: string;
	body?: string;
	categoryId?: string;
	categoryName?: string;
	inviteCode?: string;
	replyTicketId?: string;
	replyTicketCode?: string;
	replyBody?: string;
	attachments: { fileId: string; fileType: string; storageUrl: string }[];
};

export type BotContext = Context & SessionFlavor<BotSession>;
