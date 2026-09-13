<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import { FileIcon, PaperclipIcon } from 'phosphor-svelte';
	import * as Attachment from '$lib/components/ui/attachment';
	import * as Bubble from '$lib/components/ui/bubble';
	import * as Message from '$lib/components/ui/message';
	import getInitials from '$lib/utils/initials';
	import StatusBadge from './status-badge.svelte';
	import * as Marker from '$lib/components/ui/marker';

	let { ticket }: { ticket: TicketDetails } = $props();

	function formatDateTime(dateStr: string | Date) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const statusHistories = $derived(ticket.statusHistories ?? []);
	const messages = $derived(ticket.messages ?? []);
	const messageGroups = $derived.by(() => {
		const groups: { key: string; messages: TicketDetails['messages'] }[] = [];

		for (const message of messages) {
			const key = [
				message.senderType,
				message.senderUserId ?? message.senderReporterId ?? 'system',
				message.isInternal
			].join(':');
			const currentGroup = groups.at(-1);

			if (currentGroup?.key === key) {
				currentGroup.messages.push(message);
			} else {
				groups.push({ key, messages: [message] });
			}
		}

		return groups;
	});
</script>

<div class="space-y-7">
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
				<Bubble.Content class="whitespace-pre-wrap">{ticket.body}</Bubble.Content>
			</Bubble.Root>

			{#if ticket.attachments && ticket.attachments.length > 0}
				<Attachment.Group class="mt-px">
					{#each ticket.attachments as attachment (attachment.id)}
						<Attachment.Root
							size="sm"
							class="max-w-64"
							aria-label={`Open attachment ${attachment.fileType}`}
						>
							<Attachment.Media>
								<FileIcon class="size-4" />
							</Attachment.Media>
							<Attachment.Content>
								<Attachment.Title class="truncate">
									{attachment.fileType.split('/')[1]?.toUpperCase() ?? 'FILE'}
								</Attachment.Title>
								<Attachment.Description>Open attachment</Attachment.Description>
							</Attachment.Content>
							<Attachment.Actions>
								<Attachment.Action
									href={`/attachments/${attachment.id}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open attachment"
								>
									<PaperclipIcon class="size-3" />
								</Attachment.Action>
							</Attachment.Actions>
						</Attachment.Root>
					{/each}
				</Attachment.Group>
			{/if}
		</Message.Content>
	</Message.Root>

	{#each statusHistories as history (history.id)}
		{#if history.note}
			<Message.Root align="end">
				<Message.Avatar class="size-10 bg-secondary font-semibold text-secondary-foreground">
					{getInitials(history.changedByUser?.name ?? 'System')}
				</Message.Avatar>
				<Message.Content>
					<Message.Header>
						<span class="font-semibold">{history.changedByUser?.name ?? 'System Agent'}</span>
						<span>{formatDateTime(history.changedAt)}</span>
					</Message.Header>
					<Bubble.Root variant="muted">
						<Bubble.Content class=" whitespace-pre-wrap">{history.note}</Bubble.Content>
					</Bubble.Root>
					<Message.Footer class="gap-1.5">
						<span>Changed status from</span>
						<StatusBadge status={history.oldStatus} />
						<span>to</span>
						<StatusBadge status={history.newStatus} />
					</Message.Footer>
				</Message.Content>
			</Message.Root>
		{:else}
			<article class="flex items-center justify-center">
				<div
					class="flex items-center gap-2 rounded-full border bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground shadow-xs backdrop-blur-sm"
				>
					<span class="font-medium text-foreground">{history.changedByUser?.name ?? 'System'}</span>
					<span>changed status to</span>
					<StatusBadge status={history.newStatus} />
					<span class="ml-1 text-[10px] opacity-70">{formatDateTime(history.changedAt)}</span>
				</div>
			</article>
		{/if}
	{/each}

	{#each messageGroups as group (group.key + group.messages[0].id)}
		{@const firstMessage = group.messages[0]}
		{@const lastMessage = group.messages[group.messages.length - 1]}
		<Message.Root align={firstMessage.senderType === 'agent' ? 'end' : 'start'}>
			<Message.Avatar
				class={`self-end ${
					firstMessage.senderType === 'agent'
						? 'size-10 bg-secondary font-semibold text-secondary-foreground'
						: 'size-10 bg-primary/10 font-semibold text-primary'
				}`}
			>
				{getInitials(
					firstMessage.senderUser?.name ?? firstMessage.senderReporter?.fullName ?? 'System'
				)}
			</Message.Avatar>
			<Message.Content>
				<Message.Header>
					<span class="font-semibold">
						{firstMessage.senderUser?.name ?? firstMessage.senderReporter?.fullName ?? 'System'}
					</span>
					{#if firstMessage.isInternal}
						<span class="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700"
							>Internal</span
						>
					{/if}
					<span>{formatDateTime(lastMessage.createdAt)}</span>
				</Message.Header>
				<Bubble.Group>
					{#each group.messages as message (message.id)}
						<Bubble.Root variant={message.senderType === 'agent' ? 'default' : 'muted'}>
							<Bubble.Content
								class={message.senderType === 'agent'
									? 'whitespace-pre-wrap'
									: 'whitespace-pre-wrap'}
							>
								{message.body}
							</Bubble.Content>
						</Bubble.Root>
					{/each}
				</Bubble.Group>
			</Message.Content>
		</Message.Root>
	{/each}

	{#if ticket.status === 'closed'}
		<Marker.Root variant="separator">
			<Marker.Content>Conversation closed</Marker.Content>
		</Marker.Root>
	{/if}
</div>
