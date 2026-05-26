<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import TicketsTable from '$lib/features/tickets/components/tickets-table.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Tickets</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading
			title="Tickets"
			description="View and manage all organization-wide support incidents and feedback."
		/>
	</div>

	<TicketsTable
		tickets={data.tickets}
		totalCount={data.totalCount}
		page={data.page}
		limit={data.limit}
	/>
</div>
