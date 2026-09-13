import { eq } from 'drizzle-orm';
import { db, reportAttachments } from '@trak/database';
import type { CreateAttachmentInput } from './report.types';
import { createAuditLog } from './audit.service';

export async function addReportAttachment(input: CreateAttachmentInput): Promise<void> {
	const [attachment] = await db
		.insert(reportAttachments)
		.values({
			reportId: input.reportId,
			fileId: input.fileId,
			fileType: input.fileType,
			storageUrl: `telegram://${input.fileId}`
		})
		.returning({ id: reportAttachments.id });

	await createAuditLog({
		action: 'ticket.attachment_added',
		entityType: 'attachment',
		entityId: attachment.id,
		afterData: {
			reportId: input.reportId,
			fileType: input.fileType,
			source: 'telegram'
		}
	});
}

export async function getReportAttachmentById(id: string) {
	return db.query.reportAttachments.findFirst({
		where: eq(reportAttachments.id, id),
		with: { report: true, message: true }
	});
}
