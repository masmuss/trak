<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import TicketPriorityForm from './ticket-priority-form.svelte';

	import TicketDetailsSidebar from './ticket-details-sidebar.svelte';
	import TicketConversation from './ticket-conversation.svelte';
	import type { TicketDetails } from '@trak/shared';
	import { Textarea } from '$lib/components/ui/textarea';
	import { handleFormError } from '$lib/utils/form';
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let { ticket }: { ticket: TicketDetails } = $props();

	function formatDateTime(dateStr: string | Date) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	let selectedStatus = $derived(ticket.status);
	let noteText = $state('');

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];

	const statusEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;
			if (result.type === 'success') {
				noteText = '';
				toast.success('Status updated');
				await update();
			}
		};
	};
</script>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
		<!-- Left: Conversation & Status Update -->
		<div class="xl:col-span-8 2xl:col-span-9">
			<Card.Root>
				<Card.Header
					class="flex flex-col justify-between gap-5 border-b sm:flex-row sm:items-center"
				>
					<div class="min-w-0">
						<div class="flex items-center gap-2 text-xs text-muted-foreground">
							<span class="font-bold tracking-wider uppercase">Ticket #{ticket.ticketCode}</span>
						</div>
						<h3 class="truncate text-lg font-medium text-foreground">
							{ticket.title}
						</h3>
						<p class="text-sm text-muted-foreground">
							{formatDateTime(ticket.createdAt)}
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<PriorityBadge priority={ticket.priority} />
						<StatusBadge status={ticket.status} />
					</div>
				</Card.Header>

				<Card.Content>
					<ScrollArea class="h-96">
						<TicketConversation {ticket} />
					</ScrollArea>
				</Card.Content>

				<Card.Footer>
					<form method="POST" action="?/updateStatus" use:enhance={statusEnhance} class="w-full">
						<input type="hidden" name="status" value={selectedStatus} />
						<Textarea
							name="note"
							placeholder="Add a note about this status change..."
							bind:value={noteText}
							class="min-h-24"
						/>
						<div class="mt-3 flex items-center justify-between gap-3">
							<Select.Root type="single" bind:value={selectedStatus}>
								<Select.Trigger class="w-44">
									{statusOptions.find((o) => o.value === selectedStatus)?.label ?? 'Select Status'}
								</Select.Trigger>
								<Select.Content>
									{#each statusOptions as option (option.value)}
										<Select.Item {...option} />
									{/each}
								</Select.Content>
							</Select.Root>
							<Button type="submit" disabled={selectedStatus === ticket.status}>
								Update Status
							</Button>
						</div>
					</form>
				</Card.Footer>
			</Card.Root>
		</div>

		<!-- Right: Sidebar -->
		<div class="xl:col-span-4 2xl:col-span-3">
			<TicketDetailsSidebar {ticket} />
			<div class="mt-5">
				<TicketPriorityForm {ticket} />
			</div>
		</div>
	</div>
</div>
