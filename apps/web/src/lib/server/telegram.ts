export type TelegramFetch = (url: string) => Promise<Response>;

export class TelegramProxyError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'TelegramProxyError';
		this.status = status;
	}
}

type TelegramGetFileResult = {
	ok: boolean;
	result?: { file_path?: string };
};

export function getAttachmentFilename(fileId: string, fileType: string): string {
	const generatedName = fileId.match(
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-(.+)$/i
	)?.[1];
	const extension = fileType.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'bin';
	const filename = generatedName || `attachment.${extension}`;

	return filename.replace(/[^a-z0-9._-]/gi, '_');
}

export function proxyResponseHeaders(filename: string, fileType: string): Record<string, string> {
	return {
		'Cache-Control': 'private, max-age=300',
		'Content-Disposition': `inline; filename="${filename}"`,
		'Content-Type': fileType
	};
}

/**
 * Downloads a Telegram attachment through the Bot API and returns the raw
 * body stream. Throws TelegramProxyError with an HTTP status for every
 * failure branch so routes can map it directly to `error(status, message)`.
 */
export async function downloadTelegramAttachment(
	fetchFn: TelegramFetch,
	botToken: string | undefined,
	fileId: string
): Promise<ReadableStream> {
	if (!botToken) {
		throw new TelegramProxyError(
			503,
			'Attachment service is not configured. Set TELEGRAM_BOT_TOKEN in the root .env and restart the web server.'
		);
	}

	const fileResponse = await fetchFn(
		`https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`
	);
	if (!fileResponse.ok) {
		throw new TelegramProxyError(502, 'Unable to locate attachment');
	}

	const fileResult = (await fileResponse.json()) as TelegramGetFileResult;
	const filePath = fileResult.result?.file_path;
	if (!fileResult.ok || !filePath) {
		throw new TelegramProxyError(404, 'Attachment file not found');
	}

	const contentResponse = await fetchFn(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
	if (!contentResponse.ok || !contentResponse.body) {
		throw new TelegramProxyError(502, 'Unable to download attachment');
	}

	return contentResponse.body as ReadableStream;
}
