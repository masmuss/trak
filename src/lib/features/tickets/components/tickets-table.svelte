<script lang="ts">
	import { DotsThreeVerticalIcon } from 'phosphor-svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import type { TicketWithRelations } from '$lib/features/tickets/types';

	let { tickets = [] }: { tickets?: TicketWithRelations[] } = $props();

	const statusStyles: Record<string, string> = {
		open: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900',
		in_progress:
			'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
		resolved:
			'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900',
		closed:
			'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-900'
	};

	function formatStatus(status: string) {
		return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function formatDate(date: Date) {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getInitials(name: string) {
		return (
			name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.slice(0, 2)
				.toUpperCase() || 'U'
		);
	}
</script>

<Table class="border">
	<TableHeader>
		<TableRow class="rounded-md border bg-card">
			<TableHead class="w-[120px]">Ticket ID</TableHead>
			<TableHead>Subject</TableHead>
			<TableHead>Reporter</TableHead>
			<TableHead>Category</TableHead>
			<TableHead>Status</TableHead>
			<TableHead>Date Created</TableHead>
			<TableHead class="w-[80px]">Actions</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#if tickets.length === 0}
			<TableRow>
				<TableCell colspan={7} class="h-24 text-center text-muted-foreground">
					No tickets found.
				</TableCell>
			</TableRow>
		{:else}
			{#each tickets as ticket (ticket.id)}
				<TableRow>
					<TableCell class="font-mono text-xs">
						#TK-{ticket.id.slice(0, 8).toUpperCase()}
					</TableCell>
					<TableCell class="font-medium">
						<a href={resolve(`/tickets/${ticket.id}`)} class="hover:text-primary hover:underline">
							{ticket.title}
						</a>
					</TableCell>
					<TableCell>
						<div class="flex items-center gap-2">
							<div
								class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary"
							>
								{getInitials(ticket.reporter.fullName)}
							</div>
							<div class="flex flex-col">
								<span class="text-sm leading-none font-medium">{ticket.reporter.fullName}</span>
								{#if ticket.reporter.username}
									<span class="text-xs text-muted-foreground">@{ticket.reporter.username}</span>
								{/if}
							</div>
						</div>
					</TableCell>
					<TableCell>
						{ticket.category?.name ?? 'Uncategorized'}
					</TableCell>
					<TableCell>
						<span
							class="text-label-sm rounded-lg border px-2.5 py-1 text-xs font-semibold {statusStyles[
								ticket.status
							] || statusStyles.open}"
						>
							{formatStatus(ticket.status)}
						</span>
					</TableCell>
					<TableCell class="text-sm text-muted-foreground">
						{formatDate(new Date(ticket.createdAt))}
					</TableCell>
					<TableCell>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button variant="ghost" size="icon" {...props}>
										<DotsThreeVerticalIcon class="size-4" />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-36 rounded-lg">
								<DropdownMenu.Item onSelect={() => goto(resolve(`/tickets/${ticket.id}`))}>
									View Details
								</DropdownMenu.Item>
								<DropdownMenu.Item>Assign Agent</DropdownMenu.Item>
								<DropdownMenu.Item class="text-destructive focus:text-destructive">
									Delete Ticket
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</TableCell>
				</TableRow>
			{/each}
		{/if}
	</TableBody>
</Table>
