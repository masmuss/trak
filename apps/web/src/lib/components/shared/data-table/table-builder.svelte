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
		pageIndex = $bindable(0),
		pageSize = $bindable(10),
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

	// Initialize filter manager and table state
	let filterManager = $state(new FilterManager(config.filters || []));
	let tableState = $state(
		urlSync
			? createTableState({
					filterManager,
					urlSync: { enabled: true },
					defaultState: {
						pagination: {
							page: 1,
							pageSize: config.defaults?.pageSize || 10
						},
						sorting: config.defaults?.sorting || [],
						columnVisibility: config.defaults?.columnVisibility || {}
					}
				})
			: createSimpleTableState({
					pagination: {
						page: 1,
						pageSize: config.defaults?.pageSize || 10
					},
					sorting: config.defaults?.sorting || [],
					columnVisibility: config.defaults?.columnVisibility || {}
				})
	);

	// Reactive sync with external data
	$effect(() => {
		// Sync pageIndex with state
		if (tableState.pagination.page !== undefined) {
			pageIndex = tableState.pagination.page - 1;
		}
		// Sync pageSize with state
		if (tableState.pagination.pageSize !== undefined) {
			pageSize = tableState.pagination.pageSize;
		}
	});

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
	bind:pageIndex
	bind:pageSize
	{pageCount}
	{manualPagination}
	enableSorting={config.features?.sorting !== false}
	enableRowSelection={config.features?.rowSelection !== false}
	enableColumnVisibility={config.features?.columnVisibility !== false}
>
	{#snippet toolbar(table)}
		<TableToolbar>
			<div class="flex flex-wrap items-center gap-4">
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
