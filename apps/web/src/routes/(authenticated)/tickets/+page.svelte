<script lang="ts">
	import { TicketIcon, ClockCountdownIcon, CheckCircleIcon } from 'phosphor-svelte';
	import Heading from '$lib/components/shared/heading.svelte';
	import TicketsTable from '$lib/features/tickets/components/tickets-table.svelte';
	import TicketStats from '$lib/features/tickets/components/ticket-stats.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let statsItems = $derived([
		{
			value: data.stats.total,
			label: 'Total Tickets',
			icon: TicketIcon,
			color: 'bg-indigo-500/10 text-indigo-500'
		},
		{
			value: data.stats.pending,
			label: 'Pending',
			icon: ClockCountdownIcon,
			color: 'bg-amber-500/10 text-amber-500'
		},
		{
			value: data.stats.solved,
			label: 'Solved',
			icon: CheckCircleIcon,
			color: 'bg-emerald-500/10 text-emerald-500'
		}
	]);
</script>

<svelte:head>
	<title>Tickets</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading
			title="Support Tickets"
			description="View and manage all organization-wide support incidents and feedback."
		/>
	</div>

	<TicketStats items={statsItems} />

	<TicketsTable
		tickets={data.tickets}
		totalCount={data.totalCount}
		page={data.page}
		limit={data.limit}
		categories={data.categories}
	/>
</div>
