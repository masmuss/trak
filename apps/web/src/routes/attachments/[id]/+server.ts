import { error } from '@sveltejs/kit';
import { getReportAttachmentById } from '@trak/services';
import { downloadAttachment } from '$lib/server/storage';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params, fetch }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const attachment = await getReportAttachmentById(params.id);
	if (!attachment) {
		throw error(404, 'Attachment not found');
	}

	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	if (attachment.storageUrl.startsWith('s3://')) {
		const content = await downloadAttachment(attachment.fileId);
		return new Response(content.Body as ReadableStream, {
			headers: {
				'Cache-Control': 'private, max-age=300',
				'Content-Disposition': 'inline',
				'Content-Type': attachment.fileType
			}
		});
	}

	if (!botToken) {
		throw error(
			503,
			'Attachment service is not configured. Set TELEGRAM_BOT_TOKEN in the root .env and restart the web server.'
		);
	}

	const fileResponse = await fetch(
		`https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(attachment.fileId)}`
	);
	if (!fileResponse.ok) {
		throw error(502, 'Unable to locate attachment');
	}

	const fileResult = (await fileResponse.json()) as {
		ok: boolean;
		result?: { file_path?: string };
	};
	const filePath = fileResult.result?.file_path;
	if (!fileResult.ok || !filePath) {
		throw error(404, 'Attachment file not found');
	}

	const contentResponse = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
	if (!contentResponse.ok || !contentResponse.body) {
		throw error(502, 'Unable to download attachment');
	}

	return new Response(contentResponse.body, {
		headers: {
			'Cache-Control': 'private, max-age=300',
			'Content-Disposition': 'inline',
			'Content-Type': attachment.fileType
		}
	});
};
