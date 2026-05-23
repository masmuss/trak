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

	<div
		class="bg-surface-container-lowest border-outline-variant soft-shadow overflow-hidden rounded-xl border"
	>
		<!-- Pagination -->
		<div
			class="border-outline-variant bg-surface-container-low/30 flex items-center justify-between border-t px-6 py-4"
		>
			<p class="text-body-sm text-on-surface-variant">
				Showing <span class="text-on-surface font-bold">1-{data.tickets.length}</span> of
				<span class="text-on-surface font-bold">{data.tickets.length}</span> reports
			</p>
			<div class="flex items-center gap-1">
				<button
					class="border-outline-variant text-on-surface-variant hover:bg-surface-container-low flex h-9 w-9 items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-30"
				>
					<span class="material-symbols-outlined">chevron_left</span>
				</button>
				<button
					class="text-on-primary font-label-md text-label-md flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
					>1</button
				>
				<button
					class="border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low flex h-9 w-9 items-center justify-center rounded-lg border"
					>2</button
				>
				<button
					class="border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low flex h-9 w-9 items-center justify-center rounded-lg border"
					>3</button
				>
				<span class="text-on-surface-variant px-2">...</span>
				<button
					class="border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low flex h-9 w-9 items-center justify-center rounded-lg border"
					>248</button
				>
				<button
					class="border-outline-variant text-on-surface-variant hover:bg-surface-container-low flex h-9 w-9 items-center justify-center rounded-lg border"
				>
					<span class="material-symbols-outlined">chevron_right</span>
				</button>
			</div>
		</div>
	</div>
</div>
