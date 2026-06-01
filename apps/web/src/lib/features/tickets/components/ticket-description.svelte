<script lang="ts">
	import StatusBadge from './status-badge.svelte';
	import PriorityBadge from './priority-badge.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { TicketDetails } from '../types.js';
	import { PaperclipIcon, TagIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';

	let { ticket }: { ticket: TicketDetails } = $props();
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
					Ticket ID: #{ticket.id.slice(0, 8)}
				</span>
				<Separator orientation="vertical" class="h-3" />
				<span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
					<TagIcon class="size-3" />
					{ticket.category?.name ?? 'Uncategorized'}
				</span>
			</div>
			<h1 class="text-2xl font-bold tracking-tight md:text-3xl">{ticket.title}</h1>
		</div>
		<div class="flex items-center gap-2">
			<PriorityBadge priority={ticket.priority} />
			<StatusBadge status={ticket.status} />
		</div>
	</div>

	<Separator />

	<Card.Root>
		<Card.Header>
			<Card.Title>Incident Description</Card.Title>
			<Card.Description>Detailed description submitted by the reporter.</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{ticket.body}</p>

			{#if ticket.attachments && ticket.attachments.length > 0}
				<Separator />
				<div class="p-6">
					<h4 class="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
						<PaperclipIcon class="size-4" />
						Attachments ({ticket.attachments.length})
					</h4>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
						{#each ticket.attachments as attachment (attachment.id)}
							<a
								href={attachment.storageUrl}
								target="_blank"
								rel="external noopener noreferrer"
								class="group relative flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
							>
								{#if attachment.fileType.startsWith('image/')}
									<img
										src={attachment.storageUrl}
										alt="Attachment"
										class="max-h-24 rounded-md object-contain"
									/>
								{:else}
									<div
										class="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
									>
										<PaperclipIcon class="size-6" />
									</div>
									<span
										class="w-full truncate text-center text-xs font-medium text-muted-foreground group-hover:text-foreground"
									>
										Download File
									</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
