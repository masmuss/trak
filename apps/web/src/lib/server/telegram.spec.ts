import { describe, expect, it, vi } from 'vitest';
import {
	downloadTelegramAttachment,
	getAttachmentFilename,
	proxyResponseHeaders,
	TelegramProxyError
} from './telegram';

function jsonResponse(payload: unknown, ok = true): Response {
	return new Response(JSON.stringify(payload), { status: ok ? 200 : 500 });
}

function streamResponse(body: string): Response {
	return new Response(body, { status: 200 });
}

describe('downloadTelegramAttachment', () => {
	it('returns the file stream on success', async () => {
		const fetchFn = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({ ok: true, result: { file_path: 'photos/f.jpg' } }))
			.mockResolvedValueOnce(streamResponse('binary-bytes'));

		const body = await downloadTelegramAttachment(fetchFn, 'token', 'file-1');

		expect(fetchFn).toHaveBeenCalledTimes(2);
		expect(fetchFn.mock.calls[0]?.[0]).toContain('getFile?file_id=file-1');
		expect(fetchFn.mock.calls[1]?.[0]).toBe('https://api.telegram.org/file/bottoken/photos/f.jpg');
		const text = await new Response(body).text();
		expect(text).toBe('binary-bytes');
	});

	it('throws 503 without a bot token and never calls fetch', async () => {
		const fetchFn = vi.fn();
		const err = await downloadTelegramAttachment(fetchFn, undefined, 'file-1').catch((e) => e);
		expect(err).toBeInstanceOf(TelegramProxyError);
		expect((err as TelegramProxyError).status).toBe(503);
		expect(fetchFn).not.toHaveBeenCalled();
	});

	it('throws 502 when getFile fails', async () => {
		const fetchFn = vi.fn().mockResolvedValueOnce(jsonResponse({}, false));
		const err = await downloadTelegramAttachment(fetchFn, 'token', 'file-1').catch((e) => e);
		expect((err as TelegramProxyError).status).toBe(502);
	});

	it('throws 404 when Telegram reports no file path', async () => {
		const fetchFn = vi.fn().mockResolvedValueOnce(jsonResponse({ ok: true, result: {} }));
		const err = await downloadTelegramAttachment(fetchFn, 'token', 'file-1').catch((e) => e);
		expect((err as TelegramProxyError).status).toBe(404);
	});

	it('throws 502 when the content download fails', async () => {
		const fetchFn = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({ ok: true, result: { file_path: 'photos/f.jpg' } }))
			.mockResolvedValueOnce(new Response(null, { status: 502 }));
		const err = await downloadTelegramAttachment(fetchFn, 'token', 'file-1').catch((e) => e);
		expect((err as TelegramProxyError).status).toBe(502);
	});
});

describe('getAttachmentFilename', () => {
	it('extracts the original name from MinIO keys', () => {
		expect(
			getAttachmentFilename('12345678-1234-1234-1234-123456789012-invoice.pdf', 'application/pdf')
		).toBe('invoice.pdf');
	});

	it('falls back to an extension-based name for Telegram file ids', () => {
		expect(getAttachmentFilename('AgACAgUAAxkD', 'image/jpeg')).toBe('attachment.jpeg');
	});

	it('sanitizes unsafe characters', () => {
		expect(getAttachmentFilename('file id/1', 'image/png')).toBe('attachment.png');
	});
});

describe('proxyResponseHeaders', () => {
	it('sets cache, disposition, and content type', () => {
		expect(proxyResponseHeaders('a.pdf', 'application/pdf')).toEqual({
			'Cache-Control': 'private, max-age=300',
			'Content-Disposition': 'inline; filename="a.pdf"',
			'Content-Type': 'application/pdf'
		});
	});
});
