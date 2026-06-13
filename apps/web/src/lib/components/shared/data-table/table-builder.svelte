<script lang="ts" generics="TData">
	import ProgressiveTable from './progressive-table.svelte';
	import type { TableConfig, SelectFilterConfig } from './types';
	import { createTableState, createSimpleTableState } from './table-state.svelte.js';
	import { FilterManager } from './filter-config';
	import {
		TableToolbar,
		SearchBar,
		FilterBar,
		ColumnToggle,
		ExportButton
	} from './toolbar/index.js';

	let {
		config,
		data,
		totalCount = 0,
		pageIndex = 0,
		pageSize = 10,
		manualPagination = false,
		urlSync = true
	}: {
		config: TableConfig<TData>;
		data: TData[];
		totalCount?: number;
		pageIndex?: number;
		pageSize?: number;
		manualPagination?: boolean;
		urlSync?: boolean;
	} = $props();

	// svelte-ignore state_referenced_locally
	const initialConfig = config;
	// svelte-ignore state_referenced_locally
	const isUrlSync = urlSync;
	// Initialize filter manager and table state
	let filterManager = $state(new FilterManager(initialConfig.filters || []));
	let tableState = $state(
		isUrlSync
			? createTableState({
					filterManager,
					urlSync: { enabled: true },
					defaultState: {
						pagination: {
							page: 1,
							pageSize: initialConfig.defaults?.pageSize || 10
						},
						sorting: initialConfig.defaults?.sorting || [],
						columnVisibility: initialConfig.defaults?.columnVisibility || {}
					}
				})
			: createSimpleTableState({
					pagination: {
						page: 1,
						pageSize: initialConfig.defaults?.pageSize || 10
					},
					sorting: initialConfig.defaults?.sorting || [],
					columnVisibility: initialConfig.defaults?.columnVisibility || {}
				})
	);

	// Reactive sync with external data
	$effect(() => {
		// Sync tableState -> local bindings
		if (tableState.pagination.page !== undefined && tableState.pagination.page - 1 !== pageIndex) {
			pageIndex = tableState.pagination.page - 1;
		}
		if (
			tableState.pagination.pageSize !== undefined &&
			tableState.pagination.pageSize !== pageSize
		) {
			pageSize = tableState.pagination.pageSize;
		}
	});

	// We no longer sync from local bindable to tableState via $effect.
	// Instead, we pass an explicit onPaginationChange callback down to ProgressiveTable.
	function handlePaginationChange(state: { pageIndex: number; pageSize: number }) {
		const newPage = state.pageIndex + 1;
		if (newPage !== tableState.pagination.page) {
			tableState.setPage(newPage);
		}
		if (state.pageSize !== tableState.pagination.pageSize) {
			tableState.setPageSize(state.pageSize);
		}
	}

	const pageCount = $derived(Math.ceil(totalCount / pageSize));

	// Handle search
	function handleSearch(value: string) {
		tableState.setSearch(value);
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSearch((e.target as HTMLInputElement).value);
		}
	}

	// Handle filters
	function handleFilterSelect(key: string, value: string) {
		// Check if this is a single-select filter
		const filterConfig = config.filters?.find((f) => f.key === key);
		if (filterConfig?.type === 'select') {
			// For single-select, set directly (replace current value)
			tableState.setFilter(key, value);
		} else {
			// For multi-select, toggle
			tableState.toggleFilter(key, value);
		}
	}

	function handleFilterClear(key: string) {
		tableState.clearFilter(key);
	}

	function handleClearAllFilters() {
		tableState.clearAllFilters();
	}

	// Get filter values for UI
	const filterValues = $derived(
		(config.filters || []).reduce(
			(acc, filter) => {
				const serverKey = filter.serverKey || filter.key;
				const value = tableState.filters[serverKey];
				if (value !== undefined) {
					acc[filter.key] = new Set(Array.isArray(value) ? value : [String(value)]);
				} else {
					acc[filter.key] = new Set();
				}
				return acc;
			},
			{} as Record<string, Set<string>>
		)
	);

	// Get select filter configs only
	const selectFilterConfigs = $derived(
		(config.filters || []).filter(
			(f) => f.type === 'select' || f.type === 'multi-select'
		) as SelectFilterConfig[]
	);

	// Get export URL
	const exportUrl = $derived(
		config.export?.enabled ? tableState.getExportURL(config.export?.formats?.[0] || 'csv') : ''
	);
</script>

<ProgressiveTable
	{data}
	columns={config.columns}
	{pageIndex}
	{pageSize}
	{pageCount}
	{manualPagination}
	onPaginationChange={handlePaginationChange}
	enableSorting={config.features?.sorting !== false}
	enableRowSelection={config.features?.rowSelection !== false}
	enableColumnVisibility={config.features?.columnVisibility !== false}
	initialColumnVisibility={config.defaults?.columnVisibility}
>
	{#snippet toolbar(table)}
		<TableToolbar>
			<div class="flex w-full flex-row items-center gap-2">
				{#if config.features?.search !== false}
					<SearchBar
						value={tableState.search}
						placeholder="Search..."
						onClear={() => handleSearch('')}
						onKeyDown={handleSearchKeydown}
					/>
				{/if}
				{#if selectFilterConfigs.length > 0}
					<FilterBar
						configs={selectFilterConfigs}
						selectedValues={filterValues}
						onSelect={handleFilterSelect}
						onClearFilter={handleFilterClear}
						onClearAll={handleClearAllFilters}
						hasActiveFilters={tableState.hasActiveFilters}
					/>
				{/if}
			</div>
			<div class="flex items-center justify-end gap-2">
				{#if config.export?.enabled}
					<ExportButton
						{exportUrl}
						formats={config.export.formats}
						filename={config.export.filename}
					/>
				{/if}
				{#if config.features?.columnVisibility !== false}
					<ColumnToggle {table} />
				{/if}
			</div>
		</TableToolbar>
	{/snippet}
</ProgressiveTable>
