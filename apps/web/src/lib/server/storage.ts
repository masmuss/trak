import {
	CreateBucketCommand,
	GetObjectCommand,
	HeadBucketCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { randomUUID } from 'node:crypto';

const bucket = env.MINIO_BUCKET ?? 'attachments';
const client = new S3Client({
	endpoint: env.MINIO_ENDPOINT ?? 'http://localhost:9000',
	region: env.MINIO_REGION ?? 'us-east-1',
	forcePathStyle: true,
	credentials: {
		accessKeyId: env.MINIO_ROOT_USER ?? 'trak',
		secretAccessKey: env.MINIO_ROOT_PASSWORD ?? 'trak-local-password'
	}
});

async function ensureBucket(): Promise<void> {
	try {
		await client.send(new HeadBucketCommand({ Bucket: bucket }));
	} catch {
		await client.send(new CreateBucketCommand({ Bucket: bucket }));
	}
}

export async function uploadAttachment(file: File): Promise<{
	fileId: string;
	fileType: string;
	storageUrl: string;
}> {
	await ensureBucket();
	const fileId = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: fileId,
			Body: Buffer.from(await file.arrayBuffer()),
			ContentType: file.type || 'application/octet-stream'
		})
	);

	return {
		fileId,
		fileType: file.type || 'application/octet-stream',
		storageUrl: `s3://${bucket}/${fileId}`
	};
}

export async function downloadAttachment(fileId: string) {
	const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: fileId }));
	if (!response.Body) throw new Error('Attachment object has no content');
	return response;
}
