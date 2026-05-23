import { pgTable, uuid, bigint, text, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';

export * from './auth.schema';

// Helper for standard timestamp fields
export const lifecycleDates = {
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
};

export const inviteCodes = pgTable('invite_codes', {
	id: uuid('id').defaultRandom().primaryKey(),
	code: text('code').notNull().unique(),
	isActive: boolean('is_active').notNull().default(true),
	expiresAt: timestamp('expires_at', { withTimezone: true }),
	...lifecycleDates
});

export const reporters = pgTable('reporters', {
	id: uuid('id').defaultRandom().primaryKey(),
	telegramId: bigint('telegram_id', { mode: 'bigint' }).notNull().unique(),
	username: text('username'),
	fullName: text('full_name').notNull(),
	inviteCodeId: uuid('invite_code_id').references(() => inviteCodes.id, { onDelete: 'set null' }),
	...lifecycleDates
});

export const categories = pgTable('categories', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description'),
	isActive: boolean('is_active').notNull().default(true),
	...lifecycleDates
});

export const reports = pgTable('reports', {
	id: uuid('id').defaultRandom().primaryKey(),
	reporterId: uuid('reporter_id')
		.notNull()
		.references(() => reporters.id, { onDelete: 'cascade' }),
	categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
	title: text('title').notNull(),
	body: text('body').notNull(),
	status: varchar('status', { length: 50 }).notNull().default('open'),
	...lifecycleDates
});

export const reportAttachments = pgTable('report_attachments', {
	id: uuid('id').defaultRandom().primaryKey(),
	reportId: uuid('report_id')
		.notNull()
		.references(() => reports.id, { onDelete: 'cascade' }),
	fileId: text('file_id').notNull(),
	fileType: text('file_type').notNull(),
	storageUrl: text('storage_url').notNull(),
	uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow()
});

export const statusHistories = pgTable('status_histories', {
	id: uuid('id').defaultRandom().primaryKey(),
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

// --- Relations Setup ---

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
