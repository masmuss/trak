<script lang="ts">
	import type { TicketDetails } from '../types.js';
	import TicketDescription from './ticket-description.svelte';
	import TicketTimeline from './ticket-timeline.svelte';
	import TicketStatusForm from './ticket-status-form.svelte';
	import TicketReporter from './ticket-reporter.svelte';

	let { ticket }: { ticket: TicketDetails } = $props();
</script>

<div class="flex flex-1 flex-col gap-6 p-6 pt-2">
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<TicketDescription {ticket} />
			<TicketTimeline {ticket} />
		</div>

		<div class="space-y-6">
			<TicketReporter {ticket} />
			<TicketStatusForm {ticket} />
		</div>
	</div>
</div>
