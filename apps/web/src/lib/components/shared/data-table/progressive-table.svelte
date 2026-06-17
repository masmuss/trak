<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		type Table as TableType,
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import FlexRender from '$lib/components/ui/data-table/flex-render.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Empty from '$lib/components/ui/empty/empty.svelte';
	import type { Snippet } from 'svelte';

	import {
		CaretLeftIcon,
		CaretDoubleLeftIcon,
		CaretRightIcon,
		CaretDoubleRightIcon
	} from 'phosphor-svelte';

	let {
		data,
		columns,
		toolbar,
		pageIndex = $bindable(0),
		pageSize = $bindable(10),
		pageCount = $bindable(1),
		manualPagination = false,
		enableSorting = true,
		enableRowSelection = true,
		enableColumnVisibility = true,
		initialColumnVisibility = undefined,
		onPaginationChange
	}: {
		data: TData[];
		columns: ColumnDef<TData, TValue>[];
		toolbar?: Snippet<[TableType<TData>]>;
		pageIndex?: number;
		pageSize?: number;
		pageCount?: number;
		manualPagination?: boolean;
		enableSorting?: boolean;
		enableRowSelection?: boolean;
		enableColumnVisibility?: boolean;
		initialColumnVisibility?: Record<string, boolean>;
		onPaginationChange?: (state: { pageIndex: number; pageSize: number }) => void;
	} = $props();

	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $derived<VisibilityState>(initialColumnVisibility || {});
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>([]);

	// Sorting model based on enableSorting prop
	const sortingModel = (table: TableType<TData>) =>
		enableSorting ? getSortedRowModel<TData>()(table) : getCoreRowModel<TData>()(table);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		get pageCount() {
			return manualPagination ? pageCount : undefined;
		},
		get manualPagination() {
			return manualPagination;
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			},
			get pagination() {
				return { pageIndex, pageSize };
			}
		},
		get columns() {
			return columns;
		},
		get enableRowSelection() {
			return enableRowSelection;
		},
		get enableSorting() {
			return enableSorting;
		},
		get enableHiding() {
			return enableColumnVisibility;
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onPaginationChange: (updater) => {
			let next: { pageIndex: number; pageSize: number };
			if (typeof updater === 'function') {
				next = updater({ pageIndex, pageSize });
			} else {
				next = updater;
			}

			if (onPaginationChange) {
				onPaginationChange(next);
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: (table) => sortingModel(table),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});
</script>

{#snippet Pagination({ table }: { table: TableType<TData> })}
	<div class="flex items-center justify-between px-1">
		<div class="hidden flex-1 text-sm text-muted-foreground lg:flex">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="flex w-full items-center gap-8 lg:w-fit">
			<div class="hidden items-center gap-2 lg:flex">
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					allowDeselect={false}
					type="single"
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<Select.Trigger size="sm" class="w-20">
						{String(table.getState().pagination.pageSize)}
					</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
							<Select.Item value={`${pageSize}`}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex w-fit items-center justify-center text-sm font-medium">
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</div>
			<div class="ml-auto flex items-center gap-2 lg:ml-0">
				<Button
					variant="outline"
					class="hidden size-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to first page</span>
					<CaretDoubleLeftIcon />
				</Button>
				<Button
					variant="outline"
					class="size-8 p-0"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to previous page</span>
					<CaretLeftIcon />
				</Button>
				<Button
					variant="outline"
					class="size-8 p-0"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to next page</span>
					<CaretRightIcon />
				</Button>
				<Button
					variant="outline"
					class="hidden size-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to last page</span>
					<CaretDoubleRightIcon />
				</Button>
			</div>
		</div>
	</div>
{/snippet}

<div class="space-y-4">
	{#if toolbar}
		{@render toolbar(table)}
	{/if}
	<div class="overflow-hidden rounded-lg border bg-card">
		<Table.Root>
			<Table.Header class="bg-muted/15">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							{@const meta = header.column.columnDef.meta as { className?: string } | undefined}
							<Table.Head
								colspan={header.colSpan}
								class="h-11 p-3 font-medium {meta?.className ?? ''}"
							>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							{@const meta = cell.column.columnDef.meta as { className?: string } | undefined}
							<Table.Cell class="p-3 align-middle {meta?.className ?? ''}">
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="p-0">
							<Empty class="border-0 rounded-none bg-transparent py-16">
								<div class="flex flex-col items-center gap-1.5">
									<p class="text-sm font-semibold">No results found</p>
									<p class="text-xs text-muted-foreground">
										Try adjusting your filters or search term.
									</p>
								</div>
							</Empty>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	{@render Pagination({ table })}
</div>
