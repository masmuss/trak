import { db, reporters } from '@trak/database';
import type { Reporter } from '@trak/shared';

export type ReporterWithRelations = Reporter & {
	inviteCode: {
		code: string;
	} | null;
	reports: { id: string }[];
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
