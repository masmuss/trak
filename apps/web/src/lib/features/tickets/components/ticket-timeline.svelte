<script lang="ts">
	import StatusBadge from './status-badge.svelte';
	import type { TicketDetails } from '../types.js';
	import { ClockIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';

	let { ticket }: { ticket: TicketDetails } = $props();
	const statusHistories = $derived(ticket.statusHistories ?? []);

	function formatDate(dateStr: string | Date) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Activity Log & Timeline</Card.Title>
		<Card.Description>Historical records of status transitions and agent notes.</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if statusHistories.length === 0}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<div
					class="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
				>
					<ClockIcon class="size-5" />
				</div>
				<p class="text-sm font-medium text-muted-foreground">No status modifications logged yet.</p>
				<p class="mt-1 text-xs text-muted-foreground">
					This ticket was initialized as Open on {formatDate(ticket.createdAt)}.
				</p>
			</div>
		{:else}
			<div class="relative ml-4 space-y-8 border-l border-border pl-6">
				{#each statusHistories as history (history.id)}
					<div class="relative">
						<!-- Timeline indicator dot -->
						<div
							class="absolute top-1.5 -left-8.5 flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background"
						>
							<div class="size-1.5 rounded-full bg-primary"></div>
						</div>

						<!-- Log card -->
						<div class="flex flex-col gap-1">
							<div class="flex flex-wrap items-center gap-2 text-sm">
								<span class="font-semibold text-foreground">
									{history.changedByUser?.name ?? 'System Agent'}
								</span>
								<span class="text-xs text-muted-foreground"> transitioned status from </span>
								<StatusBadge status={history.oldStatus} />
								<span class="text-xs text-muted-foreground">to</span>
								<StatusBadge status={history.newStatus} />
							</div>
							<span class="flex items-center gap-1 text-xs text-muted-foreground">
								<ClockIcon class="size-3" />
								{formatDate(history.changedAt)}
							</span>
							{#if history.note}
								<div class="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-foreground">
									{history.note}
								</div>
							{/if}
						</div>
					</div>
				{/each}

				<!-- Initial creation timeline point -->
				<div class="relative">
					<div
						class="absolute top-1.5 -left-8.5 flex size-4 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background"
					>
						<div class="size-1.5 rounded-full bg-muted-foreground/30"></div>
					</div>
					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2 text-sm">
							<span class="font-semibold text-muted-foreground">Ticket Created</span>
							<span class="text-xs text-muted-foreground">via Telegram Bot</span>
							<StatusBadge status="open" />
						</div>
						<span class="flex items-center gap-1 text-xs text-muted-foreground">
							<ClockIcon class="size-3" />
							{formatDate(ticket.createdAt)}
						</span>
					</div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
