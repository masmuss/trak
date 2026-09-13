import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { user } from './auth.schema';

export const auditLogs = pgTable('audit_logs', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	actorUserId: text('actor_user_id').references(() => user.id, {
		onDelete: 'set null'
	}),
	action: text('action').notNull(),
	entityType: text('entity_type').notNull(),
	entityId: text('entity_id').notNull(),
	beforeData: jsonb('before_data'),
	afterData: jsonb('after_data'),
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
