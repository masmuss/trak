import { db, auditLogs } from '@trak/database';

export type AuditLogInput = {
	actorUserId?: string | null;
	action: string;
	entityType: string;
	entityId: string;
	beforeData?: unknown;
	afterData?: unknown;
	metadata?: unknown;
};

export async function createAuditLog(input: AuditLogInput): Promise<void> {
	await db.insert(auditLogs).values({
		actorUserId: input.actorUserId ?? null,
		action: input.action,
		entityType: input.entityType,
		entityId: input.entityId,
		beforeData: input.beforeData,
		afterData: input.afterData,
		metadata: input.metadata
	});
}
