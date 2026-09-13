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
