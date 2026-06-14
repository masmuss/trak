<script lang="ts">
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import type { TicketDetails } from '@trak/shared';
	import { TelegramLogoIcon } from 'phosphor-svelte';
	import * as Card from '$lib/components/ui/card';

	let { ticket }: { ticket: TicketDetails } = $props();

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
		<ul class="divide-y divide-gray-100 dark:divide-gray-800">
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-gray-500 dark:text-gray-400">Customer</span>
				<span class="text-right text-sm text-gray-700 dark:text-gray-400">
					{ticket.reporter.fullName}
				</span>
			</li>
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-gray-500 dark:text-gray-400">Telegram</span>
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
				<span class="text-sm text-gray-500 dark:text-gray-400">Ticket ID</span>
				<span class="text-right text-sm text-gray-700 dark:text-gray-400">{ticket.ticketCode}</span>
			</li>
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-gray-500 dark:text-gray-400">Category</span>
				<span class="text-right text-sm text-gray-700 dark:text-gray-400">
					{ticket.category?.name ?? 'Uncategorized'}
				</span>
			</li>
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-gray-500 dark:text-gray-400">Priority</span>
				<span class="text-right">
					<PriorityBadge priority={ticket.priority} />
				</span>
			</li>
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-gray-500 dark:text-gray-400">Created</span>
				<span class="text-right text-sm text-gray-700 dark:text-gray-400">
					{formatDate(ticket.createdAt)}
				</span>
			</li>
			<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
				<span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
				<div class="text-right">
					<StatusBadge status={ticket.status} />
				</div>
			</li>
		</ul>
	</Card.Content>
</Card.Root>
