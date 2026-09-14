import { describe, expect, it } from 'vitest';
import { visibleNavGroups } from './navigation';

describe('visibleNavGroups', () => {
	it('shows everything to admin', () => {
		const groups = visibleNavGroups('admin');
		expect(groups.flatMap((g) => g.items).map((i) => i.title)).toContain('Audit Logs');
	});

	it('hides admin-only items from agents', () => {
		const groups = visibleNavGroups('agent');
		const titles = groups.flatMap((g) => g.items).map((i) => i.title);
		expect(titles).not.toContain('Audit Logs');
		expect(titles).toContain('Tickets');
	});

	it('hides admin-only items when role is missing', () => {
		const groups = visibleNavGroups(null);
		const titles = groups.flatMap((g) => g.items).map((i) => i.title);
		expect(titles).not.toContain('Audit Logs');
	});
});
