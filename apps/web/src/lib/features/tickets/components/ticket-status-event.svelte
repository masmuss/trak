<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import * as Marker from '$lib/components/ui/marker';
	import StatusBadge from './status-badge.svelte';
	import { formatDateTime } from '../utils/formatters';

	let {
		history
	}: {
		history: TicketDetails['statusHistories'][number];
	} = $props();
</script>

<Marker.Root variant="separator" role="status">
	<Marker.Content class="flex flex-wrap items-center justify-center gap-1.5 text-xs">
		<span class="font-medium text-foreground">{history.changedByUser?.name ?? 'System'}</span>
		<span>changed status to</span>
		<StatusBadge status={history.newStatus} />
		<span>{formatDateTime(history.changedAt)}</span>
		{#if history.note}
			<span class="basis-full text-center italic">“{history.note}”</span>
		{/if}
	</Marker.Content>
</Marker.Root>
