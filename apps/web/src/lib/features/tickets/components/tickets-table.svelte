<script lang="ts">
	import { TableBuilder } from '$lib/components/shared/data-table/index.js';
	import type { ColumnDef } from '@tanstack/table-core';
	import Columns from './columns.svelte';
	import type { TicketWithRelations, Category } from '$lib/features/tickets/types';
	import { createTicketsTableConfig } from '../table-config';

	let {
		tickets = [],
		totalCount = 0,
		page = 1,
		limit = 10,
		categories = []
	}: {
		tickets?: TicketWithRelations[];
		totalCount?: number;
		page?: number;
		limit?: number;
		categories?: Category[];
	} = $props();

	let columns: ColumnDef<TicketWithRelations, unknown>[] = $state([]);

	// Create table configuration without columns
	let tableConfig = $state(createTicketsTableConfig(categories));

	// Update columns in config when columns change
	$effect(() => {
		tableConfig.columns = columns;
	});

	let pageIndex = $state(0);
	let pageSize = $state(10);

	// Sync with page prop
	$effect.pre(() => {
		pageIndex = page - 1;
		pageSize = limit;
	});
</script>

<Columns bind:columns />

<TableBuilder
	config={tableConfig}
	data={tickets}
	{totalCount}
	manualPagination={true}
	bind:pageIndex
	bind:pageSize
	urlSync={true}
/>
