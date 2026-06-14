<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import TicketPriorityForm from './ticket-priority-form.svelte';
	import TicketMessageHeader from './ticket-message-header.svelte';
	import TicketDetailsSidebar from './ticket-details-sidebar.svelte';
	import type { TicketDetails } from '@trak/shared';
	import { PaperclipIcon } from 'phosphor-svelte';
	import getInitials from '$lib/utils/initials';
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

	const statusHistories = $derived(ticket.statusHistories ?? []);

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

<div class="mx-auto p-4">
	<div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
		<!-- Left: Conversation & Status Update -->
		<div class="xl:col-span-8 2xl:col-span-9">
			<Card.Root>
				<Card.Header
					class="flex flex-col justify-between gap-5 border-b sm:flex-row sm:items-center"
				>
					<div class="min-w-0">
						<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<span class="font-bold tracking-wider uppercase">Ticket #{ticket.ticketCode}</span>
						</div>
						<h3 class="truncate text-lg font-medium text-gray-800 dark:text-white/90">
							{ticket.title}
						</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
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
						<div class="space-y-7">
							<article>
								<TicketMessageHeader
									initials={getInitials(ticket.reporter.fullName)}
									name={ticket.reporter.fullName}
									subtitle={ticket.reporter.username ? '@{ticket.reporter.username}' : ''}
									timestamp={formatDateTime(ticket.createdAt)}
								/>
								<div class="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
									{ticket.body}
								</div>

								{#if ticket.attachments && ticket.attachments.length > 0}
									<div
										class="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
									>
										<PaperclipIcon class="size-4" />
										<span>{ticket.attachments.length} attachment(s)</span>
									</div>
									<div class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
										{#each ticket.attachments as attachment (attachment.id)}
											<a
												href={attachment.storageUrl}
												target="_blank"
												rel="external noopener noreferrer"
												class="group flex items-center justify-center rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
											>
												{#if attachment.fileType.startsWith('image/')}
													<img
														src={attachment.storageUrl}
														alt="Attachment"
														class="max-h-20 rounded object-contain"
													/>
												{:else}
													<div class="flex flex-col items-center gap-1">
														<PaperclipIcon class="size-5 text-gray-400" />
														<span class="max-w-24 truncate text-xs text-gray-500"
															>Download File</span
														>
													</div>
												{/if}
											</a>
										{/each}
									</div>
								{/if}
							</article>

							{#each statusHistories as history (history.id)}
								<article>
									<TicketMessageHeader
										initials={getInitials(history.changedByUser?.name ?? 'System')}
										name={history.changedByUser?.name ?? 'System Agent'}
										subtitle="Status Update"
										timestamp={formatDateTime(history.changedAt)}
										avatarClass="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
									/>
									<div
										class="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
									>
										Status changed from
										<StatusBadge status={history.oldStatus} />
										to
										<StatusBadge status={history.newStatus} />
									</div>
									{#if history.note}
										<div
											class="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground"
										>
											{history.note}
										</div>
									{/if}
								</article>
							{/each}
						</div>
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
