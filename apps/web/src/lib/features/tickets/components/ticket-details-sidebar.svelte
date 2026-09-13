<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import * as Card from '$lib/components/ui/card';
	import TicketContactSection from './ticket-contact-section.svelte';
	import TicketMetadataList from './ticket-metadata-list.svelte';
	import TicketAssignmentSection from './ticket-assignment-section.svelte';

	let {
		ticket,
		agents = [],
		currentUser
	}: {
		ticket: TicketDetails;
		agents?: { id: string; name: string }[];
		currentUser?: { id: string; role?: string | null };
	} = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Ticket Details</Card.Title>
	</Card.Header>
	<Card.Content class="p-0">
		<ul class="divide-y divide-border">
			<TicketContactSection reporter={ticket.reporter} />
			<TicketMetadataList {ticket} />
			<TicketAssignmentSection assignee={ticket.assignee} {agents} {currentUser} />
		</ul>
	</Card.Content>
</Card.Root>
