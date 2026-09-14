export function formatDate(dateStr: string | Date): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function formatDateTime(dateStr: string | Date): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function formatRelativeTime(dateStr: string | Date): string {
	const date = new Date(dateStr);
	const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

	const divisions = [
		{ amount: 60, unit: 'second' },
		{ amount: 60, unit: 'minute' },
		{ amount: 24, unit: 'hour' },
		{ amount: 7, unit: 'day' },
		{ amount: 4.34524, unit: 'week' },
		{ amount: 12, unit: 'month' },
		{ amount: Number.POSITIVE_INFINITY, unit: 'year' }
	] as const;

	let duration = diffSeconds;
	for (const { amount, unit } of divisions) {
		if (Math.abs(duration) < amount) {
			return formatter.format(Math.round(duration), unit);
		}
		duration /= amount;
	}
	return formatter.format(Math.round(duration), 'year');
}
