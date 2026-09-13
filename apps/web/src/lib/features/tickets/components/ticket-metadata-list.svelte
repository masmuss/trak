<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import { formatDate } from '../utils/formatters';

	let {
		ticket
	}: {
		ticket: Pick<TicketDetails, 'ticketCode' | 'category' | 'priority' | 'createdAt' | 'status'>;
	} = $props();
</script>

<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Ticket ID</span>
	<span class="text-right text-sm text-foreground">{ticket.ticketCode}</span>
</li>
<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Category</span>
	<span class="text-right text-sm text-foreground">
		{ticket.category?.name ?? 'Uncategorized'}
	</span>
</li>
<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Priority</span>
	<span class="flex justify-end text-right">
		<PriorityBadge priority={ticket.priority} />
	</span>
</li>
<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Created</span>
	<span class="text-right text-sm text-foreground">
		{formatDate(ticket.createdAt)}
	</span>
</li>
<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Status</span>
	<div class="flex justify-end text-right">
		<StatusBadge status={ticket.status} />
	</div>
</li>
