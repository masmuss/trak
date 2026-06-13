// Legacy components (kept for backward compatibility)
export { default as DataTable } from './data-table.svelte';
export { default as DataTableViewOptions } from './data-table-view-options.svelte';
export { default as DataTableFacetedFilter } from './data-table-faceted-filter.svelte';
export { default as DataTableColumnHeader } from './data-table-column-header.svelte';

// New progressive table system
export { default as ProgressiveTable } from './progressive-table.svelte';
export { default as TableBuilder } from './table-builder.svelte';

// Toolbar components
export * from './toolbar/index.js';

// Types
export * from './types';

// Utilities
export {
	FilterManager,
	createFilterConfigs,
	createSelectFilter,
	createMultiSelectFilter,
	createSearchFilter,
	createDateRangeFilter
} from './filter-config';
export { createTableState, createSimpleTableState } from './table-state.svelte.js';
