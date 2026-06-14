<script lang="ts">
	import { TableBuilder } from '$lib/components/shared/data-table/index.js';
	import type { ColumnDef } from '@tanstack/table-core';
	import Columns from './columns.svelte';
	import type { TicketWithRelations, Category } from '@trak/shared';
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

	// svelte-ignore state_referenced_locally
	const initialCategories = categories;
	// Table configuration (state because it needs to be mutated)
	let tableConfig = $state(createTicketsTableConfig(initialCategories));

	// Update columns in config when columns change
	$effect(() => {
		tableConfig.columns = columns;
	});
</script>

<Columns bind:columns />

<TableBuilder
	config={tableConfig}
	data={tickets}
	{totalCount}
	manualPagination={true}
	pageIndex={page - 1}
	pageSize={limit}
	urlSync={true}
/>
