/**
 * Utility to convert an array of objects into a properly escaped CSV string.
 */
export function convertToCSV<T>(
	data: T[],
	headers: string[],
	mapper: (item: T) => (string | number | boolean | null | undefined)[]
): string {
	const escapeField = (field: unknown): string => {
		if (field === null || field === undefined) return '';
		const stringified = String(field);
		// If the field contains commas, double quotes, or newlines, wrap it in double quotes and escape existing quotes.
		if (
			stringified.includes('"') ||
			stringified.includes(',') ||
			stringified.includes('\n') ||
			stringified.includes('\r')
		) {
			return `"${stringified.replace(/"/g, '""')}"`;
		}
		return stringified;
	};

	const headerRow = headers.map(escapeField).join(',');
	const dataRows = data.map((item) => mapper(item).map(escapeField).join(','));
	return [headerRow, ...dataRows].join('\r\n');
}
