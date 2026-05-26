const counter = new Map<string, number>();

export function generateTicketNumber(): string {
	const key = 'ticket';
	const current = counter.get(key) ?? 0;
	counter.set(key, current + 1);
	return `TKT-${String(current + 1).padStart(4, '0')}`;
}
