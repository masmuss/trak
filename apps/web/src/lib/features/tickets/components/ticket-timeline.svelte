<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import * as Bubble from '$lib/components/ui/bubble';
	import * as Marker from '$lib/components/ui/marker';
	import * as Message from '$lib/components/ui/message';
	import getInitials from '$lib/utils/initials';
	import TicketStatusEvent from './ticket-status-event.svelte';
	import TicketMessageGroup from './ticket-message-group.svelte';
	import TicketAttachmentList from './ticket-attachment-list.svelte';
	import type { TimelineGroup } from '../utils/timeline';
	import { formatDateTime } from '../utils/formatters';

	let {
		ticket,
		timelineGroups
	}: {
		ticket: TicketDetails;
		timelineGroups: TimelineGroup[];
	} = $props();

	const initialAttachments = $derived(
		(ticket.attachments ?? []).filter((attachment) => attachment.messageId === null)
	);
</script>

<div class="space-y-7">
	<!-- Initial ticket report message -->
	<Message.Root>
		<Message.Avatar class="size-10 bg-primary/10 font-semibold text-primary">
			{getInitials(ticket.reporter.fullName)}
		</Message.Avatar>
		<Message.Content>
			<Message.Header>
				<span class="text-sm font-semibold">{ticket.reporter.fullName}</span>
				{#if ticket.reporter.username}
					<span class="text-xs text-muted-foreground">@{ticket.reporter.username}</span>
				{/if}
				<span class="ms-auto">{formatDateTime(ticket.createdAt)}</span>
			</Message.Header>
			<Bubble.Root variant="muted">
				<Bubble.Content>{ticket.body}</Bubble.Content>
			</Bubble.Root>

			<TicketAttachmentList attachments={initialAttachments} class="mt-px" />
		</Message.Content>
	</Message.Root>

	<!-- Chronological events (status changes & messages) -->
	{#each timelineGroups as group (group.kind === 'status' ? group.history.id : group.key + group.messages[0].id)}
		{#if group.kind === 'status'}
			<TicketStatusEvent history={group.history} />
		{:else}
			<TicketMessageGroup messages={group.messages} />
		{/if}
	{/each}

	{#if ticket.status === 'closed'}
		<Marker.Root variant="separator">
			<Marker.Content>Conversation closed</Marker.Content>
		</Marker.Root>
	{/if}
</div>
