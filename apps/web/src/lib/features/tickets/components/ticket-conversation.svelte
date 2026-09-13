<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import TicketTimeline from './ticket-timeline.svelte';
	import { buildTimelineGroups } from '../utils/timeline';

	let { ticket }: { ticket: TicketDetails } = $props();

	const timelineGroups = $derived.by(() => buildTimelineGroups(ticket));
</script>

<TicketTimeline {ticket} {timelineGroups} />
