import {
	pgTable,
	uuid,
	bigint,
	text,
	varchar,
	boolean,
	timestamp,
	jsonb,
	pgEnum
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './auth.schema';

export * from './auth.schema';

const lifecycleDates = {
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};

export const inviteCodes = pgTable('invite_codes', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	code: text('code').notNull().unique(),
	isActive: boolean('is_active').notNull().default(true),
	expiresAt: timestamp('expires_at', { withTimezone: true }),
	...lifecycleDates
});

export const reporters = pgTable('reporters', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	telegramId: bigint('telegram_id', { mode: 'bigint' }).notNull().unique(),
	username: text('username'),
	fullName: text('full_name').notNull(),
	inviteCodeId: uuid('invite_code_id').references(() => inviteCodes.id, { onDelete: 'set null' }),
	...lifecycleDates
});

export const categories = pgTable('categories', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	isActive: boolean('is_active').notNull().default(true),
	...lifecycleDates
});

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const reports = pgTable('reports', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	ticketCode: varchar('ticket_code', { length: 20 }).notNull().unique(),
	reporterId: uuid('reporter_id')
		.notNull()
		.references(() => reporters.id, { onDelete: 'cascade' }),
	categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
	title: text('title').notNull(),
	body: text('body').notNull(),
	status: varchar('status', { length: 50 }).notNull().default('open'),
	priority: priorityEnum('priority').notNull().default('MEDIUM'),
	slaResponseDue: timestamp('sla_response_due', { withTimezone: true }),
	slaResolveDue: timestamp('sla_resolve_due', { withTimezone: true }),
	firstRespondedAt: timestamp('first_response_at', { withTimezone: true }),
	resolvedAt: timestamp('resolved_at', { withTimezone: true }),
	isSlaBreached: boolean('is_sla_breached').notNull().default(false),
	...lifecycleDates
});

export const reportAttachments = pgTable('report_attachments', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	reportId: uuid('report_id')
		.notNull()
		.references(() => reports.id, { onDelete: 'cascade' }),
	fileId: text('file_id').notNull(),
	fileType: text('file_type').notNull(),
	storageUrl: text('storage_url').notNull(),
	uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow()
});

export const statusHistories = pgTable('status_histories', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	reportId: uuid('report_id')
		.notNull()
		.references(() => reports.id, { onDelete: 'cascade' }),
	changedBy: text('changed_by')
		.notNull()
		.references(() => user.id),
	oldStatus: varchar('old_status', { length: 50 }).notNull(),
	newStatus: varchar('new_status', { length: 50 }).notNull(),
	note: text('note'),
	changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow()
});

export const inviteCodesRelations = relations(inviteCodes, ({ many }) => ({
	reporters: many(reporters)
}));

export const reportersRelations = relations(reporters, ({ one, many }) => ({
	inviteCode: one(inviteCodes, {
		fields: [reporters.inviteCodeId],
		references: [inviteCodes.id]
	}),
	reports: many(reports)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	reports: many(reports)
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
	reporter: one(reporters, {
		fields: [reports.reporterId],
		references: [reporters.id]
	}),
	category: one(categories, {
		fields: [reports.categoryId],
		references: [categories.id]
	}),
	attachments: many(reportAttachments),
	statusHistories: many(statusHistories)
}));

export const reportAttachmentsRelations = relations(reportAttachments, ({ one }) => ({
	report: one(reports, {
		fields: [reportAttachments.reportId],
		references: [reports.id]
	})
}));

export const statusHistoriesRelations = relations(statusHistories, ({ one }) => ({
	report: one(reports, {
		fields: [statusHistories.reportId],
		references: [reports.id]
	}),
	changedByUser: one(user, {
		fields: [statusHistories.changedBy],
		references: [user.id]
	})
}));

export const botSessions = pgTable('bot_sessions', {
	key: text('key').primaryKey(),
	data: jsonb('data').notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const notifications = pgTable('notifications', {
	id: uuid('id')
		.default(sql`uuid_generate_v7()`)
		.primaryKey(),
	reporterTelegramId: bigint('reporter_telegram_id', { mode: 'bigint' }).notNull(),
	reportId: uuid('report_id')
		.notNull()
		.references(() => reports.id, { onDelete: 'cascade' }),
	message: text('message').notNull(),
	isRead: boolean('is_read').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
