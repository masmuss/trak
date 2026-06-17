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
												<span class="text-xs text-muted-foreground"
													>{formatDateTime(history.changedAt)}</span
												>
											</div>
											<div
												class="rounded-2xl rounded-tr-none bg-secondary p-4 text-sm leading-relaxed whitespace-pre-wrap text-primary shadow-xs"
											>
												{history.note}
											</div>
											<div class="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
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
											<span class="font-medium text-foreground"
												>{history.changedByUser?.name ?? 'System'}</span
											>
											<span>changed status to</span>
											<StatusBadge status={history.newStatus} />
											<span class="ml-1 text-[10px] opacity-70"
												>{formatDateTime(history.changedAt)}</span
											>
										</div>
									</article>
								{/if}
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
