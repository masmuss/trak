import { describe, expect, it } from 'vitest';
import { parseTicketFilters } from '../server/tickets';

describe('parseTicketFilters', () => {
	it('resolves the my assignment filter to the authenticated user', () => {
		const filters = parseTicketFilters(new URL('https://trak.test/tickets?assignedTo=my'), {
			userId: 'agent-123'
		});

		expect(filters.assignedTo).toBe('agent-123');
	});

	it('preserves unassigned and explicit agent filters', () => {
		const unassigned = parseTicketFilters(
			new URL('https://trak.test/tickets?assignedTo=unassigned')
		);
		const assigned = parseTicketFilters(new URL('https://trak.test/tickets?assignedTo=agent-456'));

		expect(unassigned.assignedTo).toBe('unassigned');
		expect(assigned.assignedTo).toBe('agent-456');
	});

	it('removes unsupported status and priority values', () => {
		const filters = parseTicketFilters(
			new URL(
				'https://trak.test/tickets?status=open,invalid&priority=HIGH,UNKNOWN&sla_breached=true'
			)
		);

		expect(filters.status).toBe('open');
		expect(filters.priority).toBe('HIGH');
		expect(filters.slaBreached).toBe('true');
	});
});
