import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatRelativeTime } from './date';

describe('date utils', () => {
	it('formats date correctly', () => {
		const date = new Date('2026-05-15T10:30:00Z');
		expect(formatDate(date)).toContain('May 15, 2026');
	});

	it('formats date-time correctly', () => {
		const date = new Date('2026-05-15T10:30:00Z');
		const formatted = formatDateTime(date);
		expect(formatted).toContain('May 15');
	});

	it('formats relative time in the past', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		expect(formatRelativeTime(fiveMinutesAgo)).toMatch(/ago/i);
	});

	it('formats relative time for yesterday', () => {
		const yesterday = new Date(Date.now() - 26 * 60 * 60 * 1000);
		expect(formatRelativeTime(yesterday)).toMatch(/yesterday|day/i);
	});
});
