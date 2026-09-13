import type { TicketDetails } from '@trak/shared';

export type TimelineStatusGroup = {
	kind: 'status';
	history: TicketDetails['statusHistories'][number];
};

export type TimelineMessagesGroup = {
	kind: 'messages';
	key: string;
	messages: TicketDetails['messages'];
};

export type TimelineGroup = TimelineStatusGroup | TimelineMessagesGroup;

export type TimelineEvent =
	| {
			kind: 'status';
			history: TicketDetails['statusHistories'][number];
	  }
	| {
			kind: 'message';
			message: TicketDetails['messages'][number];
	  };

export function buildTimeline(
	ticket: Pick<TicketDetails, 'statusHistories' | 'messages'>
): TimelineEvent[] {
	const statusHistories = ticket.statusHistories ?? [];
	const messages = ticket.messages ?? [];

	const events: TimelineEvent[] = [
		...statusHistories.map((history) => ({ kind: 'status' as const, history })),
		...messages.map((message) => ({ kind: 'message' as const, message }))
	];

	return events.sort(
		(a, b) =>
			new Date(a.kind === 'status' ? a.history.changedAt : a.message.createdAt).getTime() -
			new Date(b.kind === 'status' ? b.history.changedAt : b.message.createdAt).getTime()
	);
}

export function buildTimelineGroups(
	ticket: Pick<TicketDetails, 'statusHistories' | 'messages'>
): TimelineGroup[] {
	const timeline = buildTimeline(ticket);
	const groups: TimelineGroup[] = [];

	for (const event of timeline) {
		if (event.kind === 'status') {
			groups.push(event);
			continue;
		}

		const message = event.message;
		const key = [
			message.senderType,
			message.senderUserId ?? message.senderReporterId ?? 'system',
			message.isInternal
		].join(':');
		const currentGroup = groups.at(-1);

		if (currentGroup?.kind === 'messages' && currentGroup.key === key) {
			currentGroup.messages.push(message);
		} else {
			groups.push({ kind: 'messages', key, messages: [message] });
		}
	}

	return groups;
}
