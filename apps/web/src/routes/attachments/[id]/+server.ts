import { error } from '@sveltejs/kit';
import { getReportAttachmentById } from '@trak/services';
import { downloadAttachment } from '$lib/server/storage';
import {
	downloadTelegramAttachment,
	getAttachmentFilename,
	proxyResponseHeaders,
	TelegramProxyError
} from '$lib/server/telegram';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params, fetch }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const attachment = await getReportAttachmentById(params.id);
	if (!attachment) {
		throw error(404, 'Attachment not found');
	}

	if (attachment.message && attachment.message.reportId !== attachment.report.id) {
		throw error(404, 'Attachment not found');
	}

	const filename = getAttachmentFilename(attachment.fileId, attachment.fileType);
	if (attachment.storageUrl.startsWith('s3://')) {
		const content = await downloadAttachment(attachment.fileId);
		return new Response(content.Body as ReadableStream, {
			headers: proxyResponseHeaders(filename, attachment.fileType)
		});
	}

	if (!attachment.storageUrl.startsWith('telegram://')) {
		throw error(422, 'Unsupported attachment storage');
	}

	try {
		const body = await downloadTelegramAttachment(
			fetch,
			process.env.TELEGRAM_BOT_TOKEN,
			attachment.fileId
		);
		return new Response(body, {
			headers: proxyResponseHeaders(filename, attachment.fileType)
		});
	} catch (e) {
		if (e instanceof TelegramProxyError) throw error(e.status, e.message);
		throw e;
	}
};
