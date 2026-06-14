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
