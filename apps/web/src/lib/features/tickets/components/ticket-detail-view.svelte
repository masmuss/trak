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
										<span class="ms-auto text-xs text-muted-foreground"
											>{formatDateTime(ticket.createdAt)}</span
										>
									</div>
									<div
										class="rounded-2xl rounded-tl-none bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground shadow-xs"
									>
										{ticket.body}
									</div>

									{#if ticket.attachments && ticket.attachments.length > 0}
										<div class="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
											<PaperclipIcon class="size-4" />
											<span>{ticket.attachments.length} attachment(s)</span>
										</div>
										<div class="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-3">
											{#each ticket.attachments as attachment (attachment.id)}
												<a
													href={attachment.storageUrl}
													target="_blank"
													rel="external noopener noreferrer"
													class="group flex items-center justify-center rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50"
												>
													{#if attachment.fileType.startsWith('image/')}
														<img
															src={attachment.storageUrl}
															alt="Attachment"
															class="max-h-24 rounded object-contain"
														/>
													{:else}
														<div class="flex flex-col items-center gap-1">
															<PaperclipIcon class="size-6 text-muted-foreground" />
															<span class="max-w-24 truncate text-xs text-muted-foreground"
																>Download File</span
															>
														</div>
													{/if}
												</a>
											{/each}
										</div>
									{/if}
								</div>
							</article>

							{#each statusHistories as history (history.id)}
								<article class="flex items-center justify-center">
									<div
										class="flex flex-col items-center gap-2 rounded-full border bg-muted/30 px-4 py-2 text-xs text-muted-foreground shadow-xs backdrop-blur-sm"
									>
										<div class="flex items-center gap-2">
											<span class="font-medium text-foreground"
												>{history.changedByUser?.name ?? 'System'}</span
											>
											changed status from
											<StatusBadge status={history.oldStatus} />
											to
											<StatusBadge status={history.newStatus} />
										</div>
										{#if history.note}
											<div class="text-center leading-relaxed italic">
												"{history.note}"
											</div>
										{/if}
										<span class="text-[10px] opacity-70">{formatDateTime(history.changedAt)}</span>
									</div>
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
