<script lang="ts">
	import { TicketIcon, ClockCountdownIcon, CheckCircleIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
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

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<TicketStats items={statsItems} />

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between border-b">
			<div>
				<Card.Title>Support Tickets</Card.Title>
				<Card.Description>
					View and manage all organization-wide support incidents and feedback.
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<TicketsTable
				tickets={data.tickets}
				totalCount={data.totalCount}
				page={data.page}
				limit={data.limit}
				categories={data.categories}
			/>
		</Card.Content>
	</Card.Root>
</div>
