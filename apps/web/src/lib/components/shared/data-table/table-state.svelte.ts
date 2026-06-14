import { page } from '$app/state';
import { goto } from '$app/navigation';
import type { FilterManager } from './filter-config';
import type { TableState, TableQuery, URLSyncOptions, FilterValue, ExportFormat } from './types';
import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

function buildQuery(state: TableState): TableQuery {
	return {
		filters: state.filters,
		search: state.search || undefined,
		pagination: {
			page: state.pagination.page,
			limit: state.pagination.pageSize
		},
		sorting: state.sorting[0]
			? {
					field: state.sorting[0].id,
					direction: state.sorting[0].desc ? 'desc' : 'asc'
				}
			: undefined
	};
}

function toggleSortInPlace(state: TableState, columnId: string): void {
	if (state.sorting[0]?.id === columnId) {
		state.sorting = [{ id: columnId, desc: !state.sorting[0].desc }];
	} else {
		state.sorting = [{ id: columnId, desc: false }];
	}
}

/** Returns a snapshot of state for simple tables (no filterManager) */
function hasSimpleFilters(state: TableState): boolean {
	return (
		Object.values(state.filters).some((v) => v !== undefined && v !== null && v !== '') ||
		state.search !== ''
	);
}

/**
 * Generic Table State Management
 * Handles URL sync, filter state, search, pagination, and sorting
 */
export function createTableState(options: {
	filterManager: FilterManager;
	urlSync?: URLSyncOptions;
	defaultState?: Partial<TableState>;
}) {
	const { filterManager, urlSync = { enabled: true }, defaultState = {} } = options;

	// ============================================================================
	// URL Sync State
	// ============================================================================

	const currentUrl = $derived(page.url);

	// Parse initial state from URL
	function parseInitialState(): TableState {
		const urlFilters = filterManager.parseFromURL(currentUrl);
		const urlSearch = currentUrl.searchParams.get('search') || '';
		const urlPage = parseInt(currentUrl.searchParams.get('page') || '1');
		const urlLimit = parseInt(currentUrl.searchParams.get('limit') || '10');
		const urlSort = currentUrl.searchParams.get('sort');
		const urlOrder = currentUrl.searchParams.get('order') || 'asc';

		return {
			filters: urlFilters,
			search: urlSearch,
			pagination: {
				page: urlPage,
				pageSize: urlLimit
			},
			sorting: urlSort ? [{ id: urlSort, desc: urlOrder === 'desc' }] : [],
			columnVisibility: defaultState.columnVisibility || {},
			rowSelection: {}
		};
	}

	// Reactive state
	let state = $state<TableState>(parseInitialState());

	// Guard against the URL-watch $effect reverting state while goto is pending
	let syncCount = 0;

	// Sync state back to URL
	function syncToURL(): void {
		if (!urlSync.enabled) return;

		const nextUrl = new SvelteURL(currentUrl);
		const excludeKeys = urlSync.excludeKeys || [];

		// Sync filters
		const filterParams = filterManager.serializeToURL(state.filters);
		for (const [key, value] of filterParams) {
			if (!excludeKeys.includes(key)) {
				nextUrl.searchParams.set(key, value);
			}
		}

		// Sync search
		if (state.search && !excludeKeys.includes('search')) {
			nextUrl.searchParams.set('search', state.search);
		} else {
			nextUrl.searchParams.delete('search');
		}

		// Sync pagination
		if (!excludeKeys.includes('page')) {
			nextUrl.searchParams.set('page', String(state.pagination.page));
		}
		if (!excludeKeys.includes('limit')) {
			nextUrl.searchParams.set('limit', String(state.pagination.pageSize));
		}

		// Sync sorting
		if (state.sorting.length > 0 && !excludeKeys.includes('sort')) {
			nextUrl.searchParams.set('sort', state.sorting[0].id);
			nextUrl.searchParams.set('order', state.sorting[0].desc ? 'desc' : 'asc');
		} else {
			nextUrl.searchParams.delete('sort');
			nextUrl.searchParams.delete('order');
		}

		// Navigate if URL changed
		if (nextUrl.search !== currentUrl.search) {
			syncCount++;
			const basePath = urlSync.basePath || currentUrl.pathname;
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(basePath + nextUrl.search, {
				keepFocus: true,
				noScroll: true
			}).finally(() => {
				syncCount--;
			});
		}
	}

	// Watch for URL changes and update state
	$effect(() => {
		if (urlSync.enabled && syncCount === 0) {
			const newState = parseInitialState();
			if (JSON.stringify(newState) !== JSON.stringify(state)) {
				state = newState;
			}
		}
	});

	// ============================================================================
	// Filter Methods
	// ============================================================================

	function setFilter(key: string, value: FilterValue): void {
		state.filters = filterManager.setFilter(key, value, state.filters);
		syncToURL();
	}

	function toggleFilter(key: string, value: string): void {
		state.filters = filterManager.toggleMultiSelect(key, value, state.filters);
		syncToURL();
	}

	function clearFilter(key: string): void {
		state.filters = filterManager.clearFilter(key, state.filters);
		syncToURL();
	}

	function clearAllFilters(): void {
		state.filters = filterManager.clearFilters();
		state.search = '';
		syncToURL();
	}

	function hasActiveFilters(): boolean {
		return filterManager.hasActiveFilters(state.filters) || state.search !== '';
	}

	// ============================================================================
	// Search Methods
	// ============================================================================

	function setSearch(value: string): void {
		state.search = value;
		// Reset to page 1 when search changes
		state.pagination.page = 1;
		syncToURL();
	}

	// ============================================================================
	// Pagination Methods
	// ============================================================================

	function setPage(page: number): void {
		state.pagination.page = page;
		syncToURL();
	}

	function setPageSize(pageSize: number): void {
		state.pagination.pageSize = pageSize;
		state.pagination.page = 1; // Reset to page 1 when page size changes
		syncToURL();
	}

	// ============================================================================
	// Sorting Methods
	// ============================================================================

	function setSorting(sorting: { id: string; desc: boolean }[]): void {
		state.sorting = sorting;
		syncToURL();
	}

	function toggleSort(columnId: string): void {
		toggleSortInPlace(state, columnId);
		syncToURL();
	}

	// ============================================================================
	// Column Visibility Methods
	// ============================================================================

	function setColumnVisibility(columnId: string, visible: boolean): void {
		state.columnVisibility = {
			...state.columnVisibility,
			[columnId]: visible
		};
	}

	function toggleColumnVisibility(columnId: string): void {
		state.columnVisibility = {
			...state.columnVisibility,
			[columnId]: !state.columnVisibility[columnId]
		};
	}

	// ============================================================================
	// Row Selection Methods
	// ============================================================================

	function setRowSelection(selection: Record<string, boolean>): void {
		state.rowSelection = selection;
	}

	function toggleRowSelection(rowId: string): void {
		state.rowSelection = {
			...state.rowSelection,
			[rowId]: !state.rowSelection[rowId]
		};
	}

	function clearRowSelection(): void {
		state.rowSelection = {};
	}

	// ============================================================================
	// Export Methods
	// ============================================================================

	function getExportURL(format: ExportFormat = 'csv'): string {
		const params = new SvelteURLSearchParams(currentUrl.search);
		params.set('format', format);
		return `${currentUrl.pathname}/export?${params.toString()}`;
	}

	// ============================================================================
	// Return API
	// ============================================================================

	const api = {
		get state() {
			return state;
		},
		get filters() {
			return state.filters;
		},
		get search() {
			return state.search;
		},
		get pagination() {
			return state.pagination;
		},
		get sorting() {
			return state.sorting;
		},
		get columnVisibility() {
			return state.columnVisibility;
		},
		get rowSelection() {
			return state.rowSelection;
		},

		get hasActiveFilters() {
			return hasActiveFilters();
		},
		get query() {
			return buildQuery(state);
		},

		setFilter,
		toggleFilter,
		clearFilter,
		clearAllFilters,
		setSearch,
		setPage,
		setPageSize,
		setSorting,
		toggleSort,
		setColumnVisibility,
		toggleColumnVisibility,
		setRowSelection,
		toggleRowSelection,
		clearRowSelection,
		getExportURL,
		buildQuery: () => buildQuery(state),

		syncToURL,
		reset: () => {
			state = parseInitialState();
		}
	};
	return api;
}

/**
 * Simple state manager for non-URL-synced tables
 */
export function createSimpleTableState(defaultState?: Partial<TableState>) {
	const state = $state<TableState>({
		filters: {},
		search: '',
		pagination: {
			page: 1,
			pageSize: 10
		},
		sorting: [],
		columnVisibility: {},
		rowSelection: {},
		...defaultState
	});

	const api = {
		get state() {
			return state;
		},
		get filters() {
			return state.filters;
		},
		get search() {
			return state.search;
		},
		get pagination() {
			return state.pagination;
		},
		get sorting() {
			return state.sorting;
		},
		get columnVisibility() {
			return state.columnVisibility;
		},
		get rowSelection() {
			return state.rowSelection;
		},

		get hasActiveFilters() {
			return hasSimpleFilters(state);
		},
		get query() {
			return buildQuery(state);
		},

		setFilter: (key: string, value: FilterValue) => {
			state.filters = { ...state.filters, [key]: value };
		},
		toggleFilter: (key: string, value: string) => {
			const current = (state.filters[key] as string[]) || [];
			state.filters = {
				...state.filters,
				[key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
			};
		},
		clearFilter: (key: string) => {
			const newFilters = { ...state.filters };
			delete newFilters[key];
			state.filters = newFilters;
		},
		clearAllFilters: () => {
			state.filters = {};
			state.search = '';
		},

		setSearch: (value: string) => {
			state.search = value;
		},

		setPage: (page: number) => {
			state.pagination.page = page;
		},
		setPageSize: (pageSize: number) => {
			state.pagination.pageSize = pageSize;
		},

		setSorting: (sorting: { id: string; desc: boolean }[]) => {
			state.sorting = sorting;
		},
		toggleSort: (columnId: string) => {
			toggleSortInPlace(state, columnId);
		},

		setColumnVisibility: (columnId: string, visible: boolean) => {
			state.columnVisibility = { ...state.columnVisibility, [columnId]: visible };
		},
		toggleColumnVisibility: (columnId: string) => {
			state.columnVisibility = {
				...state.columnVisibility,
				[columnId]: !state.columnVisibility[columnId]
			};
		},

		setRowSelection: (selection: Record<string, boolean>) => {
			state.rowSelection = selection;
		},
		toggleRowSelection: (rowId: string) => {
			state.rowSelection = {
				...state.rowSelection,
				[rowId]: !state.rowSelection[rowId]
			};
		},
		clearRowSelection: () => {
			state.rowSelection = {};
		},

		getExportURL: (format: ExportFormat = 'csv') => {
			return `?format=${format}`;
		},
		buildQuery: () => buildQuery(state),

		reset: () => {
			Object.assign(state, defaultState || {});
		}
	};
	return api;
}
