import { Bot } from 'grammy';
import { BotContext } from '../types';

export type FileInfo = {
	fileId: string;
	fileType: string;
	storageUrl: string;
};

export async function processTelegramFile(
	bot: Bot<BotContext>,
	fileId: string,
	fileType?: string
): Promise<FileInfo> {
	const file = await bot.api.getFile(fileId);
	const mimeType = fileType ?? 'application/octet-stream';
	const filePath = file.file_path ?? '';
	const storageUrl = filePath
		? `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`
		: `telegram://${fileId}`;

	return {
		fileId,
		fileType: mimeType,
		storageUrl
	};
}
