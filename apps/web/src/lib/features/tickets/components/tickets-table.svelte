<script lang="ts">
	import { X, CloudArrowDownIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ColumnDef } from '@tanstack/table-core';
	import {
		DataTable,
		DataTableViewOptions,
		DataTableFacetedFilter
	} from '$lib/components/shared/data-table/index.js';
	import Columns from './columns.svelte';
	import type { TicketWithRelations } from '$lib/features/tickets/types';
	import { goto } from '$app/navigation';
	import { page as pageState } from '$app/state';
	import { resolve } from '$app/paths';

	let {
		tickets = [],
		totalCount = 0,
		page = 1,
		limit = 10
	}: {
		tickets?: TicketWithRelations[];
		totalCount?: number;
		page?: number;
		limit?: number;
	} = $props();

	let columns: ColumnDef<TicketWithRelations, unknown>[] = $state([]);

	let pageIndex = $state(0);
	let pageSize = $state(10);
	const pageCount = $derived(Math.ceil(totalCount / pageSize));

	// Keep local state in sync when url changes page/limit
	$effect.pre(() => {
		pageIndex = page - 1;
		pageSize = limit;
	});

	// Trigger navigation when pagination state changes
	$effect(() => {
		const currentUrl = pageState.url;
		const urlPage = parseInt(currentUrl.searchParams.get('page') || '1');
		const urlLimit = parseInt(currentUrl.searchParams.get('limit') || '10');

		if (pageIndex + 1 !== urlPage || pageSize !== urlLimit) {
			const nextUrl = new URL(currentUrl);
			nextUrl.searchParams.set('page', String(pageIndex + 1));
			nextUrl.searchParams.set('limit', String(pageSize));
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			goto(resolve((nextUrl.pathname + nextUrl.search) as any), {
				keepFocus: true,
				noScroll: true
			});
		}
	});

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];
</script>

<Columns bind:columns />

<DataTable
	data={tickets}
	{columns}
	bind:pageIndex
	bind:pageSize
	{pageCount}
	manualPagination={true}
>
	{#snippet toolbar(table)}
		{@const isFiltered = table.getState().columnFilters.length > 0}
		{@const statusCol = table.getColumn('status')}
		<div class="flex items-center justify-between">
			<div class="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tickets..."
					value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
					oninput={(e) => {
						table.getColumn('title')?.setFilterValue(e.currentTarget.value);
					}}
					onchange={(e) => {
						table.getColumn('title')?.setFilterValue(e.currentTarget.value);
					}}
					class="h-8 w-40 lg:w-3xs"
				/>

				{#if statusCol}
					<DataTableFacetedFilter column={statusCol} title="Status" options={statusOptions} />
				{/if}

				{#if isFiltered}
					<Button
						variant="ghost"
						onclick={() => table.resetColumnFilters()}
						class="h-8 px-2 lg:px-3"
					>
						Reset
						<X class="ms-2 size-4" />
					</Button>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					class="h-8"
					href={resolve('/tickets/export') + pageState.url.search}
					download="tickets-export.csv"
				>
					<CloudArrowDownIcon />
					Export
				</Button>
				<DataTableViewOptions {table} />
			</div>
		</div>
	{/snippet}
</DataTable>
