import type { CreateReportInput } from './report.types';
import { submitReportWithAttachments } from './ticket-submit.service';

export async function createReport(
	input: CreateReportInput
): Promise<{ id: string; ticketCode: string }> {
	return submitReportWithAttachments({ ...input, attachments: [] });
}
