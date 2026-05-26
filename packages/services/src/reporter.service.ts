import { eq } from 'drizzle-orm';
import { db, reporters } from '@trak/database';
import type { Reporter } from '@trak/shared';

export type ReporterWithRelations = Reporter & {
	inviteCode: {
		code: string;
	} | null;
	reports: { id: string }[];
};

export type CreateReporterInput = {
	telegramId: bigint;
	username?: string | null;
	fullName: string;
	inviteCodeId?: string | null;
};

export async function getReporters(): Promise<ReporterWithRelations[]> {
	return db.query.reporters.findMany({
		with: {
			inviteCode: {
				columns: { code: true }
			},
			reports: {
				columns: { id: true }
			}
		},
		orderBy: (reporters, { desc }) => [desc(reporters.createdAt)]
	}) as Promise<ReporterWithRelations[]>;
}

export async function getReporterByTelegramId(telegramId: bigint): Promise<Reporter | undefined> {
	return db.query.reporters.findFirst({
		where: eq(reporters.telegramId, telegramId)
	});
}

export async function getReporterById(id: string): Promise<Reporter | undefined> {
	return db.query.reporters.findFirst({
		where: eq(reporters.id, id)
	});
}

export async function createReporter(input: CreateReporterInput): Promise<void> {
	await db.insert(reporters).values({
		telegramId: input.telegramId,
		username: input.username ?? null,
		fullName: input.fullName,
		inviteCodeId: input.inviteCodeId ?? null
	});
}
