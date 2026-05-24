<script lang="ts">
	import TicketDetailView from '$lib/features/tickets/components/ticket-detail-view.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Ticket Details - {data.ticket?.title ?? 'Incident'}</title>
</svelte:head>

{#if data.ticket}
	<TicketDetailView ticket={data.ticket} />
{:else}
	<div class="m-6 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
		Unable to load ticket details. Please try again.
	</div>
{/if}
