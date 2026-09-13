import { describe, expect, it } from 'vitest';
import {
	AGENT_NOTIFICATION_TYPES,
	MESSAGE_SENDER_TYPES,
	PRIORITIES,
	REPORTER_NOTIFICATION_TYPES,
	TICKET_STATUSES
} from '@trak/shared';
import {
	agentNotificationTypeEnum,
	messageSenderTypeEnum,
	priorityEnum,
	reporterNotificationTypeEnum,
	ticketStatusEnum
} from '@trak/database';

describe('shared literals stay in sync with DB pgEnums', () => {
	it('ticket_status', () => {
		expect([...ticketStatusEnum.enumValues].sort()).toEqual([...TICKET_STATUSES].sort());
	});

	it('priority', () => {
		expect([...priorityEnum.enumValues].sort()).toEqual([...PRIORITIES].sort());
	});

	it('agent_notification_type', () => {
		expect([...agentNotificationTypeEnum.enumValues].sort()).toEqual(
			[...AGENT_NOTIFICATION_TYPES].sort()
		);
	});

	it('reporter_notification_type', () => {
		expect([...reporterNotificationTypeEnum.enumValues].sort()).toEqual(
			[...REPORTER_NOTIFICATION_TYPES].sort()
		);
	});

	it('message_sender_type', () => {
		expect([...messageSenderTypeEnum.enumValues].sort()).toEqual([...MESSAGE_SENDER_TYPES].sort());
	});
});
