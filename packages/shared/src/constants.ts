export const TICKET_STATUS = {
	OPEN: 'open',
	IN_PROGRESS: 'in_progress',
	RESOLVED: 'resolved',
	CLOSED: 'closed'
} as const;

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const VALID_STATUSES: TicketStatus[] = Object.values(TICKET_STATUS);
