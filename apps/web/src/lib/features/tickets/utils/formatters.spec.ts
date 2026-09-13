import { describe, expect, it } from 'vitest';
import {
	formatDate,
	formatDateTime,
	getAttachmentName,
	getActorName,
	formatStatus
} from './formatters';

describe('ticket formatters', () => {
	it('formats date correctly', () => {
		const date = new Date('2026-05-15T10:30:00Z');
		expect(formatDate(date)).toContain('May 15, 2026');
	});

	it('formats date-time correctly', () => {
		const date = new Date('2026-05-15T10:30:00Z');
		const formatted = formatDateTime(date);
		expect(formatted).toContain('May 15');
	});

	it('extracts attachment name from uuid prefix', () => {
		const fileId = '12345678-1234-1234-1234-123456789abc-invoice.pdf';
		expect(getAttachmentName(fileId, 'application/pdf')).toBe('invoice.pdf');
	});

	it('falls back to file type extension if uuid pattern does not match', () => {
		const fileId = 'plain-file-without-uuid';
		expect(getAttachmentName(fileId, 'image/png')).toBe('PNG');
	});

	it('falls back to FILE if type cannot be parsed', () => {
		const fileId = 'plain-file';
		expect(getAttachmentName(fileId, 'unknown')).toBe('FILE');
	});

	it('resolves actor name in priority order', () => {
		expect(getActorName({ name: 'Alice Agent' }, { fullName: 'Bob Reporter' })).toBe('Alice Agent');
		expect(getActorName(null, { fullName: 'Bob Reporter' })).toBe('Bob Reporter');
		expect(getActorName(null, null)).toBe('System');
		expect(getActorName(null, null, 'Custom Fallback')).toBe('Custom Fallback');
	});

	it('formats status labels correctly', () => {
		expect(formatStatus('open')).toBe('Open');
		expect(formatStatus('in_progress')).toBe('In Progress');
		expect(formatStatus('resolved')).toBe('Resolved');
		expect(formatStatus('closed')).toBe('Closed');
		expect(formatStatus('other')).toBe('other');
	});
});
