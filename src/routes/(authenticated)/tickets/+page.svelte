<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import TicketsTable from '$lib/features/tickets/components/tickets-table.svelte';
	import type { PageData } from './$types';

	import { CloudArrowDownIcon, FunnelIcon, PlusIcon } from 'phosphor-svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Tickets</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading
			title="Reports List"
			description="View and manage all organization-wide support incidents and feedback."
		/>
		<div class="flex items-center gap-2">
			<Button variant="outline">
				<FunnelIcon />
				Filter
			</Button>
			<Button variant="outline">
				<CloudArrowDownIcon />
				Export
			</Button>
			<Button>
				<PlusIcon />
				Create New Ticket
			</Button>
		</div>
	</div>

	<TicketsTable tickets={data.tickets} />
</div>
