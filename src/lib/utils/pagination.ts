export interface PaginatedResult<T> {
	data: T[];
	totalCount: number;
	page: number;
	limit: number;
}

export function parsePaginationParams(url: URL) {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '10'));
	return {
		page,
		limit,
		offset: (page - 1) * limit
	};
}
