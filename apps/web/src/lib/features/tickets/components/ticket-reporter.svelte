<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { TicketDetails } from '../types.js';
	import { UserIcon, TelegramLogoIcon, CalendarIcon, ClockIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';

	let { ticket }: { ticket: TicketDetails } = $props();

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

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Reporter Profile</Card.Title>
		<Card.Description>Information about the incident reporter.</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
			>
				{getInitials(ticket.reporter.fullName)}
			</div>
			<div class="min-w-0">
				<h4 class="truncate text-sm font-semibold text-foreground">{ticket.reporter.fullName}</h4>
				{#if ticket.reporter.username}
					<a
						href="https://t.me/{ticket.reporter.username}"
						target="_blank"
						rel="external noopener noreferrer"
						class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
					>
						<TelegramLogoIcon class="size-3" />
						@{ticket.reporter.username}
					</a>
				{:else}
					<span class="text-xs text-muted-foreground">No Username</span>
				{/if}
			</div>
		</div>

		<Separator />

		<div class="space-y-3 text-sm">
			<div class="flex items-center justify-between">
				<span class="flex items-center gap-1.5 text-muted-foreground">
					<UserIcon class="size-4" />
					Telegram ID
				</span>
				<span class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
					{String(ticket.reporter.telegramId)}
				</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="flex items-center gap-1.5 text-muted-foreground">
					<CalendarIcon class="size-4" />
					Submitted On
				</span>
				<span class="text-xs font-medium text-foreground">
					{formatDate(ticket.createdAt)}
				</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="flex items-center gap-1.5 text-muted-foreground">
					<ClockIcon class="size-4" />
					Last Updated
				</span>
				<span class="text-xs font-medium text-foreground">
					{formatDate(ticket.updatedAt)}
				</span>
			</div>
		</div>
	</Card.Content>
</Card.Root>
