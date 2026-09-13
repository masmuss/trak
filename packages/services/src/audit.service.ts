import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { auditLogs, db, user } from '@trak/database';
import type { AuditAction, AuditEntityType } from '@trak/shared';

export type AuditLogInput = {
	actorUserId?: string | null;
	action: AuditAction;
	entityType: AuditEntityType;
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

export type AuditLogFilters = {
	action?: string;
	entityType?: string;
	search?: string;
	limit?: number;
	offset?: number;
};

export async function getAuditLogs(filters: AuditLogFilters = {}) {
	const conditions = [];

	if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
	if (filters.entityType) conditions.push(eq(auditLogs.entityType, filters.entityType));
	if (filters.search) {
		conditions.push(
			or(
				ilike(auditLogs.entityId, `%${filters.search}%`),
				ilike(auditLogs.action, `%${filters.search}%`)
			)
		);
	}

	return db
		.select({
			id: auditLogs.id,
			action: auditLogs.action,
			entityType: auditLogs.entityType,
			entityId: auditLogs.entityId,
			createdAt: auditLogs.createdAt,
			actor: { id: user.id, name: user.name, email: user.email }
		})
		.from(auditLogs)
		.leftJoin(user, eq(auditLogs.actorUserId, user.id))
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(desc(auditLogs.createdAt))
		.limit(filters.limit ?? 50)
		.offset(filters.offset ?? 0);
}
