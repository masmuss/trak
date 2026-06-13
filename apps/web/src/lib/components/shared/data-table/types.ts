import type { ColumnDef } from '@tanstack/table-core';
import type { Component } from 'svelte';

/**
 * Base types for progressive table system
 * Level 1: Simple table (display only)
 * Level 2: Table + sorting + pagination
 * Level 3: Full data table (filters, search, export, bulk actions)
 */

// ============================================================================
// Filter Configuration Types
// ============================================================================

export type FilterType = 'select' | 'multi-select' | 'search' | 'date-range' | 'date';

export interface FilterOption<T = string> {
	label: string;
	value: T;
	icon?: Component;
	count?: number;
}

export interface BaseFilterConfig<T = string> {
	key: string;
	title: string;
	type: FilterType;
	options?: FilterOption<T>[];
	serverKey?: string; // Key yang dikirim ke server, default sama dengan key
	placeholder?: string;
}

export interface SelectFilterConfig<T = string> extends BaseFilterConfig<T> {
	type: 'select' | 'multi-select';
	options: FilterOption<T>[];
}

export interface SearchFilterConfig extends BaseFilterConfig {
	type: 'search';
	placeholder?: string;
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
	type: 'date-range';
	presets?: DateRangePreset[];
}

export interface DateFilterConfig extends BaseFilterConfig {
	type: 'date';
}

export type FilterConfig =
	| SelectFilterConfig
	| SearchFilterConfig
	| DateRangeFilterConfig
	| DateFilterConfig;

export interface TableFilterConfig {
	filters: FilterConfig[];
	defaultValues?: Record<string, unknown>;
}

// ============================================================================
// Table Configuration Types
// ============================================================================

export interface ExportConfig {
	enabled: boolean;
	formats?: ExportFormat[];
	filename?: string;
	getData?: (filters: ParsedFilters) => Promise<unknown[]>;
}

export type ExportFormat = 'csv' | 'excel' | 'json';

export interface BulkActionConfig<T = unknown> {
	label: string;
	icon?: Component;
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	action: (selectedRows: T[]) => Promise<void> | void;
	confirm?: {
		title: string;
		description: string;
	};
}

export interface TableConfig<TData = unknown> {
	// Columns definition
	columns: ColumnDef<TData, unknown>[];

	// Filter configuration
	filters?: FilterConfig[];

	// Export configuration
	export?: ExportConfig;

	// Bulk actions
	bulkActions?: BulkActionConfig<TData>[];

	// Table features
	features?: {
		sorting?: boolean;
		pagination?: boolean;
		rowSelection?: boolean;
		columnVisibility?: boolean;
		search?: boolean;
	};

	// Default states
	defaults?: {
		pageSize?: number;
		sorting?: { id: string; desc: boolean }[];
		columnVisibility?: Record<string, boolean>;
	};
}

// ============================================================================
// Table State Types
// ============================================================================

export interface TableState {
	filters: ParsedFilters;
	search: string;
	pagination: {
		page: number;
		pageSize: number;
	};
	sorting: {
		id: string;
		desc: boolean;
	}[];
	columnVisibility: Record<string, boolean>;
	rowSelection: Record<string, boolean>;
}

export interface TableQuery {
	filters: ParsedFilters;
	search?: string;
	pagination: {
		page: number;
		limit: number;
	};
	sorting?: {
		field: string;
		direction: 'asc' | 'desc';
	};
}

// ============================================================================
// Date Range Types
// ============================================================================

export interface DateRange {
	from?: Date;
	to?: Date;
}

export interface DateRangePreset {
	label: string;
	range: DateRange;
}

// ============================================================================
// Server Integration Types
// ============================================================================

export interface ServerTableResponse<TData> {
	data: TData[];
	total: number;
	page: number;
	limit: number;
}

export interface TableDataFetcher<TData> {
	(query: TableQuery): Promise<ServerTableResponse<TData>>;
}

// ============================================================================
// Utility Types
// ============================================================================

export type FilterValue = string | string[] | Date | DateRange | undefined;

export interface ParsedFilters {
	[key: string]: FilterValue;
}

export interface URLSyncOptions {
	enabled?: boolean;
	basePath?: string;
	excludeKeys?: string[];
}
