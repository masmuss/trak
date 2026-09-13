import { priorityEnum, ticketStatusEnum } from '@trak/database';
import type { Priority, TicketStatus } from './types';

export const TICKET_STATUS = {
	OPEN: 'open',
	IN_PROGRESS: 'in_progress',
	RESOLVED: 'resolved',
	CLOSED: 'closed'
} as const satisfies Record<string, TicketStatus>;

export const VALID_STATUSES: TicketStatus[] = [...ticketStatusEnum.enumValues];

export const VALID_PRIORITIES: Priority[] = [...priorityEnum.enumValues];

export function isTicketStatus(value: unknown): value is TicketStatus {
	return (VALID_STATUSES as string[]).includes(value as string);
}

export function isPriority(value: unknown): value is Priority {
	return (VALID_PRIORITIES as string[]).includes(value as string);
}

export function toTicketStatusList(value: string | null | undefined): TicketStatus[] {
	if (!value) return [];
	return value.split(',').filter(isTicketStatus);
}

export function toPriorityList(value: string | null | undefined): Priority[] {
	if (!value) return [];
	return value.split(',').filter(isPriority);
}

export const STATUS_LABEL: Record<TicketStatus, string> = {
	open: '🔴 Open',
	in_progress: '🟡 In Progress',
	resolved: '🟢 Resolved',
	closed: '⚪ Closed'
};

export function getStatusLabel(status: TicketStatus): string {
	return STATUS_LABEL[status];
}

export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
export const MAX_REPORT_TITLE_LENGTH = 200;
export const MAX_REPORT_BODY_LENGTH = 5000;
