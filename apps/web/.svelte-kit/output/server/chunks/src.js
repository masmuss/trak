import { n as __exportAll } from "./chunk.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { bigint, boolean, index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
//#region ../../packages/database/src/auth.schema.ts
var user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
	role: text("role").default("agent"),
	isActive: boolean("is_active").default(true)
});
var session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
}, (table) => [index("session_userId_idx").on(table.userId)]);
var account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [index("account_userId_idx").on(table.userId)]);
var verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);
var userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account)
}));
var sessionRelations = relations(session, ({ one }) => ({ user: one(user, {
	fields: [session.userId],
	references: [user.id]
}) }));
var accountRelations = relations(account, ({ one }) => ({ user: one(user, {
	fields: [account.userId],
	references: [user.id]
}) }));
//#endregion
//#region ../../packages/database/src/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	account: () => account,
	accountRelations: () => accountRelations,
	categories: () => categories,
	categoriesRelations: () => categoriesRelations,
	inviteCodes: () => inviteCodes,
	inviteCodesRelations: () => inviteCodesRelations,
	reportAttachments: () => reportAttachments,
	reportAttachmentsRelations: () => reportAttachmentsRelations,
	reporters: () => reporters,
	reportersRelations: () => reportersRelations,
	reports: () => reports,
	reportsRelations: () => reportsRelations,
	session: () => session,
	sessionRelations: () => sessionRelations,
	statusHistories: () => statusHistories,
	statusHistoriesRelations: () => statusHistoriesRelations,
	user: () => user,
	userRelations: () => userRelations,
	verification: () => verification
});
var lifecycleDates = {
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
};
var inviteCodes = pgTable("invite_codes", {
	id: uuid("id").defaultRandom().primaryKey(),
	code: text("code").notNull().unique(),
	isActive: boolean("is_active").notNull().default(true),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	...lifecycleDates
});
var reporters = pgTable("reporters", {
	id: uuid("id").defaultRandom().primaryKey(),
	telegramId: bigint("telegram_id", { mode: "bigint" }).notNull().unique(),
	username: text("username"),
	fullName: text("full_name").notNull(),
	inviteCodeId: uuid("invite_code_id").references(() => inviteCodes.id, { onDelete: "set null" }),
	...lifecycleDates
});
var categories = pgTable("categories", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
	isActive: boolean("is_active").notNull().default(true),
	...lifecycleDates
});
var reports = pgTable("reports", {
	id: uuid("id").defaultRandom().primaryKey(),
	reporterId: uuid("reporter_id").notNull().references(() => reporters.id, { onDelete: "cascade" }),
	categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
	title: text("title").notNull(),
	body: text("body").notNull(),
	status: varchar("status", { length: 50 }).notNull().default("open"),
	...lifecycleDates
});
var reportAttachments = pgTable("report_attachments", {
	id: uuid("id").defaultRandom().primaryKey(),
	reportId: uuid("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
	fileId: text("file_id").notNull(),
	fileType: text("file_type").notNull(),
	storageUrl: text("storage_url").notNull(),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow()
});
var statusHistories = pgTable("status_histories", {
	id: uuid("id").defaultRandom().primaryKey(),
	reportId: uuid("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
	changedBy: text("changed_by").notNull().references(() => user.id),
	oldStatus: varchar("old_status", { length: 50 }).notNull(),
	newStatus: varchar("new_status", { length: 50 }).notNull(),
	note: text("note"),
	changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow()
});
var inviteCodesRelations = relations(inviteCodes, ({ many }) => ({ reporters: many(reporters) }));
var reportersRelations = relations(reporters, ({ one, many }) => ({
	inviteCode: one(inviteCodes, {
		fields: [reporters.inviteCodeId],
		references: [inviteCodes.id]
	}),
	reports: many(reports)
}));
var categoriesRelations = relations(categories, ({ many }) => ({ reports: many(reports) }));
var reportsRelations = relations(reports, ({ one, many }) => ({
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
var reportAttachmentsRelations = relations(reportAttachments, ({ one }) => ({ report: one(reports, {
	fields: [reportAttachments.reportId],
	references: [reports.id]
}) }));
var statusHistoriesRelations = relations(statusHistories, ({ one }) => ({
	report: one(reports, {
		fields: [statusHistories.reportId],
		references: [reports.id]
	}),
	changedByUser: one(user, {
		fields: [statusHistories.changedBy],
		references: [user.id]
	})
}));
//#endregion
//#region ../../packages/database/src/index.ts
var _db = null;
var _connectionString;
function initDb(connectionString) {
	_connectionString = connectionString;
}
function getClient() {
	if (!_db) {
		const connectionString = _connectionString || process.env.DATABASE_URL;
		if (!connectionString) throw new Error("DATABASE_URL is not set");
		_db = drizzle(postgres(connectionString), { schema: schema_exports });
	}
	return _db;
}
var db = new Proxy({}, { get(_, prop) {
	return getClient()[prop];
} });
//#endregion
export { statusHistories as i, initDb as n, reports as r, db as t };
