import type { ReporterNotificationType } from '@trak/shared';

export type CreateNotificationInput = {
	reporterTelegramId: bigint;
	reportId: string;
	type: ReporterNotificationType;
	message: string;
	dedupKey?: string;
};
