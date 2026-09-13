import { and, count, desc, eq, gte, ilike, lte, or, type SQL } from 'drizzle-orm';
import { auditLogs, db, user, type DatabaseTransaction } from '@trak/database';
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

export async function createAuditLog(
	input: AuditLogInput,
	tx?: DatabaseTransaction
): Promise<void> {
	const client = tx ?? db;
	await client.insert(auditLogs).values({
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
	from?: Date;
	to?: Date;
	limit?: number;
	offset?: number;
};

function buildAuditConditions(filters: AuditLogFilters): SQL | undefined {
	const conditions: SQL[] = [];

	if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
	if (filters.entityType) conditions.push(eq(auditLogs.entityType, filters.entityType));
	if (filters.from) conditions.push(gte(auditLogs.createdAt, filters.from));
	if (filters.to) conditions.push(lte(auditLogs.createdAt, filters.to));
	if (filters.search) {
		const searchCondition = or(
			ilike(auditLogs.entityId, `%${filters.search}%`),
			ilike(auditLogs.action, `%${filters.search}%`)
		);
		if (searchCondition) conditions.push(searchCondition);
	}

	return conditions.length ? and(...conditions) : undefined;
}

export async function getAuditLogs(filters: AuditLogFilters = {}) {
	return db
		.select({
			id: auditLogs.id,
			action: auditLogs.action,
			entityType: auditLogs.entityType,
			entityId: auditLogs.entityId,
			beforeData: auditLogs.beforeData,
			afterData: auditLogs.afterData,
			createdAt: auditLogs.createdAt,
			actor: { id: user.id, name: user.name, email: user.email }
		})
		.from(auditLogs)
		.leftJoin(user, eq(auditLogs.actorUserId, user.id))
		.where(buildAuditConditions(filters))
		.orderBy(desc(auditLogs.createdAt))
		.limit(filters.limit ?? 50)
		.offset(filters.offset ?? 0);
}

export async function getAuditLogsCount(filters: AuditLogFilters = {}): Promise<number> {
	const result = await db
		.select({ count: count(auditLogs.id) })
		.from(auditLogs)
		.where(buildAuditConditions(filters));
	return Number(result[0]?.count ?? 0);
}
