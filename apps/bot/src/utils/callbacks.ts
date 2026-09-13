/**
 * Central callback_data protocol. Keyboards build payloads with the
 * `encode*` helpers; handlers parse them back with `parse*`.
 * No ad-hoc `category_${id}` string concatenation outside this module.
 */

export const STATIC_CALLBACK = {
	NEW_REPORT: 'new_report',
	SHOW_COMMANDS: 'show_commands',
	CANCEL_CATEGORY: 'cancel_category',
	SKIP_ATTACHMENT: 'skip_attachment',
	CONFIRM_REPORT: 'confirm_report',
	CANCEL_REPORT: 'cancel_report',
	SELECT_CATEGORY: 'select_category',
	CONFIRM_REPLY: 'confirm_reply',
	REPLY_ATTACHMENT: 'reply_attachment',
	CANCEL_REPLY: 'cancel_reply'
} as const;

export type StaticCallback = (typeof STATIC_CALLBACK)[keyof typeof STATIC_CALLBACK];

const CATEGORY_PREFIX = 'category_';
const STATUS_PREFIX = 'status_';
const REPLY_PREFIX = 'reply_';

export function encodeCategoryCallback(categoryId: string): string {
	return `${CATEGORY_PREFIX}${categoryId}`;
}

export function parseCategoryCallback(data: string): string | null {
	return data.startsWith(CATEGORY_PREFIX) ? data.slice(CATEGORY_PREFIX.length) : null;
}

export function encodeStatusCallback(ticketCode: string): string {
	return `${STATUS_PREFIX}${ticketCode}`;
}

export function parseStatusCallback(data: string): string | null {
	return data.startsWith(STATUS_PREFIX) ? data.slice(STATUS_PREFIX.length) : null;
}

export function encodeReplyCallback(ticketCode: string): string {
	return `${REPLY_PREFIX}${ticketCode}`;
}

export function parseReplyCallback(data: string): string | null {
	return data.startsWith(REPLY_PREFIX) ? data.slice(REPLY_PREFIX.length) : null;
}
