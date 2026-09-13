import { describe, expect, it } from 'vitest';
import { buildTimeline, buildTimelineGroups } from './timeline';
import type { TicketDetails } from '@trak/shared';

describe('timeline utilities', () => {
	const mockUser: TicketDetails['statusHistories'][number]['changedByUser'] = {
		id: 'user-1',
		name: 'Agent 1',
		email: 'agent1@trak.com',
		emailVerified: true,
		image: null,
		role: 'agent',
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const mockStatusHistory1: TicketDetails['statusHistories'][number] = {
		id: 'hist-1',
		reportId: 'tkt-1',
		changedBy: 'user-1',
		oldStatus: 'open',
		newStatus: 'in_progress',
		changedAt: new Date('2026-05-15T10:00:00Z'),
		note: 'Taking over ticket',
		changedByUser: mockUser
	};

	const mockStatusHistory2: TicketDetails['statusHistories'][number] = {
		id: 'hist-2',
		reportId: 'tkt-1',
		changedBy: 'user-1',
		oldStatus: 'in_progress',
		newStatus: 'resolved',
		changedAt: new Date('2026-05-15T12:00:00Z'),
		note: 'Issue fixed',
		changedByUser: mockUser
	};

	const mockMessage1: TicketDetails['messages'][number] = {
		id: 'msg-1',
		reportId: 'tkt-1',
		senderType: 'agent',
		senderUserId: 'user-1',
		senderReporterId: null,
		body: 'Hello, looking into this',
		isInternal: false,
		createdAt: new Date('2026-05-15T10:05:00Z'),
		senderUser: mockUser,
		senderReporter: null,
		attachments: []
	};

	const mockMessage2: TicketDetails['messages'][number] = {
		id: 'msg-2',
		reportId: 'tkt-1',
		senderType: 'agent',
		senderUserId: 'user-1',
		senderReporterId: null,
		body: 'Another agent message',
		isInternal: false,
		createdAt: new Date('2026-05-15T10:06:00Z'),
		senderUser: mockUser,
		senderReporter: null,
		attachments: []
	};

	const mockMessage3: TicketDetails['messages'][number] = {
		id: 'msg-3',
		reportId: 'tkt-1',
		senderType: 'reporter',
		senderUserId: null,
		senderReporterId: 'rep-1',
		body: 'Thank you!',
		isInternal: false,
		createdAt: new Date('2026-05-15T10:10:00Z'),
		senderUser: null,
		senderReporter: {
			id: 'rep-1',
			telegramId: BigInt(12345),
			username: 'reporter1',
			fullName: 'Reporter One',
			inviteCodeId: null,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		attachments: []
	};

	it('sorts timeline events chronologically', () => {
		const events = buildTimeline({
			statusHistories: [mockStatusHistory2, mockStatusHistory1],
			messages: [mockMessage3, mockMessage1]
		});

		expect(events.map((e) => e.kind)).toEqual(['status', 'message', 'message', 'status']);
		expect(events[0].kind === 'status' && events[0].history.id).toBe('hist-1');
		expect(events[1].kind === 'message' && events[1].message.id).toBe('msg-1');
		expect(events[2].kind === 'message' && events[2].message.id).toBe('msg-3');
		expect(events[3].kind === 'status' && events[3].history.id).toBe('hist-2');
	});

	it('groups consecutive messages from the same sender', () => {
		const groups = buildTimelineGroups({
			statusHistories: [mockStatusHistory1],
			messages: [mockMessage1, mockMessage2, mockMessage3]
		});

		expect(groups).toHaveLength(3);
		expect(groups[0].kind).toBe('status');
		expect(groups[1].kind).toBe('messages');
		if (groups[1].kind === 'messages') {
			expect(groups[1].messages).toHaveLength(2);
			expect(groups[1].messages[0].id).toBe('msg-1');
			expect(groups[1].messages[1].id).toBe('msg-2');
		}
		expect(groups[2].kind).toBe('messages');
		if (groups[2].kind === 'messages') {
			expect(groups[2].messages).toHaveLength(1);
			expect(groups[2].messages[0].id).toBe('msg-3');
		}
	});

	it('handles empty status histories and messages', () => {
		const groups = buildTimelineGroups({
			statusHistories: [],
			messages: []
		});

		expect(groups).toEqual([]);
	});
});
