import { randomUUID } from 'node:crypto';
import { afterEach } from 'vitest';
import { sql } from 'drizzle-orm';
import { db, user } from '@trak/database';
import { createReport } from '../report.service';
import { createReporter } from '../reporter.service';
import type { Priority } from '@trak/shared';

let counter = 0;
function unique(prefix: string): string {
	return `${prefix}-${Date.now()}-${counter++}-${randomUUID().slice(0, 8)}`;
}

async function truncateAll(): Promise<void> {
	await db.execute(sql`
		TRUNCATE
			ticket_messages,
			report_attachments,
			status_histories,
			notifications,
			agent_notifications,
			audit_logs,
			reports,
			reporters,
			invite_codes,
			categories,
			bot_sessions,
			"user"
		CASCADE
	`);
}

afterEach(async () => {
	await truncateAll();
});

export async function createTestUser(role: 'admin' | 'agent' = 'agent') {
	const id = unique('user');
	const email = `${id}@test.local`;
	await db.insert(user).values({ id, name: `Test ${role}`, email, role, isActive: true });
	return { id, email, role };
}

export async function createTestReporter() {
	const telegramId = BigInt(Date.now()) * 1000n + BigInt(counter++);
	await createReporter({
		telegramId,
		username: null,
		fullName: unique('Reporter'),
		inviteCodeId: null
	});
	const { getReporterByTelegramId } = await import('../reporter.service');
	const reporter = await getReporterByTelegramId(telegramId);
	if (!reporter) throw new Error('test reporter not created');
	return reporter;
}

export async function createTestTicket(
	reporterId: string,
	overrides?: { title?: string; body?: string; priority?: Priority }
) {
	const { id, ticketCode } = await createReport({
		reporterId,
		categoryId: null,
		title: overrides?.title ?? unique('Ticket title'),
		body: overrides?.body ?? 'Test ticket body'
	});
	if (overrides?.priority) {
		const { updateTicketPriority } = await import('../ticket-status.service');
		const { id: adminId } = await createTestUser('admin');
		await updateTicketPriority(id, overrides.priority, { id: adminId, role: 'admin' });
	}
	const { getTicketById } = await import('../ticket-query.service');
	const ticket = await getTicketById(id);
	if (!ticket) throw new Error('test ticket not created');
	return { ...ticket, ticketCode };
}
