<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import * as Bubble from '$lib/components/ui/bubble';
	import * as Message from '$lib/components/ui/message';
	import getInitials from '$lib/utils/initials';
	import TicketAttachmentList from './ticket-attachment-list.svelte';
	import { formatDateTime, getActorName } from '../utils/formatters';

	let {
		messages
	}: {
		messages: TicketDetails['messages'];
	} = $props();

	const firstMessage = $derived(messages[0]);
	const lastMessage = $derived(messages[messages.length - 1]);
	const isAgent = $derived(firstMessage?.senderType === 'agent');
	const senderName = $derived(getActorName(firstMessage?.senderUser, firstMessage?.senderReporter));
</script>

{#if firstMessage}
	<Message.Root align={isAgent ? 'end' : 'start'}>
		<Message.Avatar
			class={`self-end ${
				isAgent
					? 'size-10 bg-secondary font-semibold text-secondary-foreground'
					: 'size-10 bg-primary/10 font-semibold text-primary'
			}`}
		>
			{getInitials(senderName)}
		</Message.Avatar>
		<Message.Content>
			<Message.Header>
				<span class="font-semibold">{senderName}</span>
				{#if firstMessage.isInternal}
					<span class="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700"
						>Internal</span
					>
				{/if}
				<span>{formatDateTime(lastMessage.createdAt)}</span>
			</Message.Header>
			<Bubble.Group class={isAgent ? 'w-full items-end' : undefined}>
				{#each messages as message (message.id)}
					<Bubble.Root variant={isAgent ? 'default' : 'muted'}>
						<Bubble.Content>{message.body}</Bubble.Content>
					</Bubble.Root>
					<TicketAttachmentList attachments={message.attachments} itemClass="max-w-64" />
				{/each}
			</Bubble.Group>
		</Message.Content>
	</Message.Root>
{/if}
