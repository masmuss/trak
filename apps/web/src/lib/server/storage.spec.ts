import { describe, expect, it } from 'vitest';
import { downloadAttachment, uploadAttachment } from './storage';

describe('MinIO attachment storage', () => {
	it('roundtrips bytes through upload and download', async () => {
		const bytes = new TextEncoder().encode('hello-minio-roundtrip');
		const file = new File([bytes], 'hello.txt', { type: 'text/plain' });

		const uploaded = await uploadAttachment(file);
		expect(uploaded.storageUrl).toMatch(/^s3:\/\//);
		expect(uploaded.fileType).toBe('text/plain');

		const downloaded = await downloadAttachment(uploaded.fileId);
		const raw = (await (
			downloaded.Body as unknown as { transformToByteArray: () => Promise<Uint8Array> }
		).transformToByteArray()) as Uint8Array;
		expect(new TextDecoder().decode(raw)).toBe('hello-minio-roundtrip');
	});

	it('sanitizes unsafe characters in stored keys', async () => {
		const file = new File(['x'], 'laporan/../../ penting.pdf', { type: 'application/pdf' });
		const uploaded = await uploadAttachment(file);
		expect(uploaded.fileId).not.toMatch(/\.\.\/|[/\\]/);
		expect(uploaded.fileId.endsWith('.pdf')).toBe(true);
	});
});
