<script lang="ts">
	import { TicketIcon, ClockCountdownIcon, CheckCircleIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
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
			title="Support Tickets"
			description="View and manage all organization-wide support incidents and feedback."
		/>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<TicketIcon class="size-5 text-muted-foreground" />
					<Card.Title>Total Tickets</Card.Title>
				</div>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">
				{data.stats.total.toLocaleString()}
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<ClockCountdownIcon class="size-5 text-amber-500" />
					<Card.Title>Pending</Card.Title>
				</div>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">
				{data.stats.pending.toLocaleString()}
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<CheckCircleIcon class="size-5 text-emerald-500" />
					<Card.Title>Solved</Card.Title>
				</div>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">
				{data.stats.solved.toLocaleString()}
			</Card.Content>
		</Card.Root>
	</div>

	<TicketsTable
		tickets={data.tickets}
		totalCount={data.totalCount}
		page={data.page}
		limit={data.limit}
	/>
</div>
