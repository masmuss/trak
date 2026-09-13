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

export function getAttachmentName(fileId: string, fileType: string): string {
	const generatedName = fileId.match(
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-(.+)$/i
	)?.[1];

	return generatedName ?? fileType.split('/')[1]?.toUpperCase() ?? 'FILE';
}

export function getActorName(
	user?: { name: string } | null,
	reporter?: { fullName: string } | null,
	fallback = 'System'
): string {
	return user?.name ?? reporter?.fullName ?? fallback;
}

export function formatStatus(status: string): string {
	const map: Record<string, string> = {
		open: 'Open',
		in_progress: 'In Progress',
		resolved: 'Resolved',
		closed: 'Closed'
	};
	return map[status] ?? status;
}
