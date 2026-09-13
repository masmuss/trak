<script lang="ts">
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import type { TicketDetails } from '@trak/shared';
	import { TelegramLogoIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	let {
		ticket,
		agents = [],
		currentUser
	}: {
		ticket: TicketDetails;
		agents?: { id: string; name: string }[];
		currentUser?: { id: string; role?: string | null };
	} = $props();

	let selectedAssignee = $derived('');

	$effect.pre(() => {
		selectedAssignee = ticket.assignee?.id ?? '';
	});

	function formatDate(dateStr: string | Date) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Ticket Details</Card.Title>
	</Card.Header>
	<Card.Content class="p-0">
		<ul class="divide-y divide-border">
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-muted-foreground">Customer</span>
				<span class="text-right text-sm text-foreground">
					{ticket.reporter.fullName}
				</span>
			</li>
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-muted-foreground">Telegram</span>
				<a
					href="https://t.me/{ticket.reporter.username}"
					target="_blank"
					rel="external noopener noreferrer"
					class="inline-flex items-center justify-end gap-1 text-right text-sm text-primary hover:underline"
				>
					<TelegramLogoIcon class="size-3" />
					@{ticket.reporter.username}
				</a>
			</li>
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
			<li class="space-y-2 px-6 py-2.5">
				<span class="text-sm text-muted-foreground">Assigned To</span>
				<p class="text-sm text-foreground">{ticket.assignee?.name ?? 'Unassigned'}</p>
				{#if !ticket.assignee}
					<form method="POST" action="?/claim">
						<Button type="submit" size="sm" variant="outline">Claim ticket</Button>
					</form>
				{/if}
				{#if currentUser?.role === 'admin'}
					<form method="POST" action="?/assign" class="flex gap-2">
						<input type="hidden" name="assigneeId" value={selectedAssignee} />
						<Select.Root type="single" bind:value={selectedAssignee}>
							<Select.Trigger class="min-w-0 flex-1">
								{agents.find((agent) => agent.id === selectedAssignee)?.name ?? 'Unassigned'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" label="Unassigned" />
								{#each agents as agent (agent.id)}
									<Select.Item value={agent.id} label={agent.name} />
								{/each}
							</Select.Content>
						</Select.Root>
						<Button type="submit">Save</Button>
					</form>
				{/if}
			</li>
		</ul>
	</Card.Content>
</Card.Root>
