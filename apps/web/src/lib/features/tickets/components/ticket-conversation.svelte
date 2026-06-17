<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import { PaperclipIcon } from 'phosphor-svelte';
	import getInitials from '$lib/utils/initials';
	import StatusBadge from './status-badge.svelte';

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
</script>

<div class="space-y-7">
	<article class="flex gap-4">
		<div
			class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
		>
			{getInitials(ticket.reporter.fullName)}
		</div>
		<div class="flex flex-1 flex-col gap-1.5">
			<div class="flex items-center gap-2">
				<span class="text-sm font-semibold">{ticket.reporter.fullName}</span>
				{#if ticket.reporter.username}
					<span class="text-xs text-muted-foreground">@{ticket.reporter.username}</span>
				{/if}
				<span class="ms-auto text-xs text-muted-foreground">{formatDateTime(ticket.createdAt)}</span
				>
			</div>
			<div
				class="rounded-2xl rounded-tl-none bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground shadow-xs"
			>
				{ticket.body}
			</div>

			{#if ticket.attachments && ticket.attachments.length > 0}
				<div class="mt-px flex flex-wrap gap-1.5">
					{#each ticket.attachments as attachment (attachment.id)}
						<a
							href={attachment.storageUrl}
							target="_blank"
							rel="external noopener noreferrer"
							class="inline-flex h-7 items-center gap-1.5 rounded-md border bg-secondary px-2.5 py-0.5 text-xs font-normal text-secondary-foreground transition-colors hover:bg-secondary/80"
						>
							<PaperclipIcon class="size-3" />
							<span>Attachment</span>
							<span class="opacity-60">
								{attachment.fileType.split('/')[1]?.toUpperCase() ?? 'FILE'}
							</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</article>

	{#each statusHistories as history (history.id)}
		{#if history.note}
			<article class="flex flex-row-reverse gap-4">
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground"
				>
					{getInitials(history.changedByUser?.name ?? 'System')}
				</div>
				<div class="flex flex-1 flex-col items-end gap-1.5">
					<div class="flex flex-row-reverse items-center gap-2">
						<span class="text-sm font-semibold"
							>{history.changedByUser?.name ?? 'System Agent'}</span
						>
						<span class="text-xs text-muted-foreground">{formatDateTime(history.changedAt)}</span>
					</div>
					<div
						class="rounded-2xl rounded-tr-none bg-secondary p-3 text-sm leading-relaxed whitespace-pre-wrap text-primary shadow-xs"
					>
						{history.note}
					</div>
					<div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
						<span>Changed status from</span>
						<StatusBadge status={history.oldStatus} />
						<span>to</span>
						<StatusBadge status={history.newStatus} />
					</div>
				</div>
			</article>
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
</div>
