<script lang="ts">
	import { X } from 'phosphor-svelte';
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

	let { tickets = [] }: { tickets?: TicketWithRelations[] } = $props();

	let columns: ColumnDef<TicketWithRelations, unknown>[] = $state([]);

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];
</script>

<Columns bind:columns />

<DataTable data={tickets} {columns}>
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
			<DataTableViewOptions {table} />
		</div>
	{/snippet}
</DataTable>
