import { describe, expect, it } from 'vitest';
import { isTicketSortKey, listTickets } from '../ticket-query.service';
import { createTestReporter, createTestTicket } from './helpers';

describe('isTicketSortKey', () => {
	it.each(['createdAt', 'ticketCode', 'title', 'status', 'priority', 'slaResolveDue'])(
		'accepts %s',
		(value) => {
			expect(isTicketSortKey(value)).toBe(true);
		}
	);

	it.each(['created_at', 'priority; DROP TABLE reports', '', null, undefined])(
		'rejects %s',
		(value) => {
			expect(isTicketSortKey(value)).toBe(false);
		}
	);
});

describe('listTickets sorting', () => {
	it('orders priority by severity (CRITICAL first on asc)', async () => {
		const reporter = await createTestReporter();
		await createTestTicket(reporter.id, { priority: 'LOW' });
		await createTestTicket(reporter.id, { priority: 'CRITICAL' });
		await createTestTicket(reporter.id, { priority: 'HIGH' });

		const result = await listTickets({ sort: 'priority', order: 'asc', limit: 10, offset: 0 });

		expect(result.tickets.map((t) => t.priority)).toEqual(['CRITICAL', 'HIGH', 'LOW']);
	});

	it('reverses priority order on desc', async () => {
		const reporter = await createTestReporter();
		await createTestTicket(reporter.id, { priority: 'LOW' });
		await createTestTicket(reporter.id, { priority: 'CRITICAL' });

		const result = await listTickets({ sort: 'priority', order: 'desc', limit: 10, offset: 0 });

		expect(result.tickets.map((t) => t.priority)).toEqual(['LOW', 'CRITICAL']);
	});

	it('falls back to newest-first on unknown sort key', async () => {
		const reporter = await createTestReporter();
		const first = await createTestTicket(reporter.id, { title: 'First ticket' });
		const second = await createTestTicket(reporter.id, { title: 'Second ticket' });

		const result = await listTickets({ sort: 'nope', limit: 10, offset: 0 });

		expect(result.tickets.map((t) => t.id)).toEqual([second.id, first.id]);
	});
});
