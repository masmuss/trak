/**
 * Browser-safe literals. This module has zero runtime dependencies —
 * never import `@trak/database` (or any node-only package) here, or the
 * client bundle breaks (`Buffer is not defined`).
 * Sync with the DB pgEnums is enforced by `literals-sync.test.ts`.
 */

export const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const AGENT_NOTIFICATION_TYPES = ['reporter_reply', 'assignment'] as const;
export type AgentNotificationType = (typeof AGENT_NOTIFICATION_TYPES)[number];

export const REPORTER_NOTIFICATION_TYPES = [
	'general',
	'status_changed',
	'priority_changed',
	'agent_reply'
] as const;
export type ReporterNotificationType = (typeof REPORTER_NOTIFICATION_TYPES)[number];

export const MESSAGE_SENDER_TYPES = ['agent', 'reporter', 'system'] as const;
export type MessageSenderType = (typeof MESSAGE_SENDER_TYPES)[number];

export const TICKET_STATUS = {
	OPEN: 'open',
	IN_PROGRESS: 'in_progress',
	RESOLVED: 'resolved',
	CLOSED: 'closed'
} as const satisfies Record<string, TicketStatus>;

export const VALID_STATUSES: TicketStatus[] = [...TICKET_STATUSES];

export const VALID_PRIORITIES: Priority[] = [...PRIORITIES];

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

export const AGENT_NOTIFICATION_TYPE_LABEL: Record<AgentNotificationType, string> = {
	reporter_reply: '💬 Balasan reporter',
	assignment: '📌 Penugasan'
};

export function getAgentNotificationTypeLabel(type: string): string {
	if (type === 'reporter_reply') return AGENT_NOTIFICATION_TYPE_LABEL.reporter_reply;
	if (type === 'assignment') return AGENT_NOTIFICATION_TYPE_LABEL.assignment;
	return type;
}

export type AuditAction =
	| 'ticket.created'
	| 'ticket.assigned'
	| 'ticket.status_changed'
	| 'ticket.priority_changed'
	| 'ticket.message_created'
	| 'ticket.attachment_added'
	| 'ticket.reopened'
	| 'category.created'
	| 'category.updated'
	| 'category.deleted'
	| 'user.created'
	| 'user.updated'
	| 'user.deleted'
	| 'invite_code.created'
	| 'invite_code.updated'
	| 'invite_code.deleted';

export type AuditEntityType =
	'ticket' | 'ticket_message' | 'attachment' | 'category' | 'user' | 'invite_code';

export const AUDIT_ACTIONS: AuditAction[] = [
	'ticket.created',
	'ticket.assigned',
	'ticket.status_changed',
	'ticket.priority_changed',
	'ticket.message_created',
	'ticket.attachment_added',
	'ticket.reopened',
	'category.created',
	'category.updated',
	'category.deleted',
	'user.created',
	'user.updated',
	'user.deleted',
	'invite_code.created',
	'invite_code.updated',
	'invite_code.deleted'
];

export const AUDIT_ENTITY_TYPES: AuditEntityType[] = [
	'ticket',
	'ticket_message',
	'attachment',
	'category',
	'user',
	'invite_code'
];

export function isAuditAction(value: unknown): value is AuditAction {
	return (AUDIT_ACTIONS as string[]).includes(value as string);
}

export function isAuditEntityType(value: unknown): value is AuditEntityType {
	return (AUDIT_ENTITY_TYPES as string[]).includes(value as string);
}

export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
export const MAX_REPORT_TITLE_LENGTH = 200;
export const MAX_REPORT_BODY_LENGTH = 5000;
