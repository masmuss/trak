import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime } from './date';

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
});
