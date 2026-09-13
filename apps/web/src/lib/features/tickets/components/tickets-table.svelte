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
		categories = [],
		agents = [],
		currentUser
	}: {
		tickets?: TicketWithRelations[];
		totalCount?: number;
		page?: number;
		limit?: number;
		categories?: Category[];
		agents?: { id: string; name: string }[];
		currentUser?: { role?: string | null };
	} = $props();

	let columns: ColumnDef<TicketWithRelations, unknown>[] = $state([]);

	// svelte-ignore state_referenced_locally
	const initialCategories = categories;
	// svelte-ignore state_referenced_locally
	const initialAgents = agents;
	// Table configuration (state because it needs to be mutated)
	// svelte-ignore state_referenced_locally
	let tableConfig = $state(
		createTicketsTableConfig(initialCategories, initialAgents, currentUser?.role)
	);

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
