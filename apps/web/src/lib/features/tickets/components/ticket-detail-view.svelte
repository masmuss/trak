<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import PriorityBadge from './priority-badge.svelte';
	import StatusBadge from './status-badge.svelte';
	import type { TicketDetails } from '../types.js';
	import { ArrowLeft, Paperclip, TelegramLogoIcon, CheckCircle } from 'phosphor-svelte';
	import getInitials from '$lib/utils/initials';
	import { handleFormError } from '$lib/utils/form';

	let { ticket }: { ticket: TicketDetails } = $props();

	function formatDateTime(dateStr: string | Date) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDate(dateStr: string | Date) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	let selectedStatus = $state('open');

	$effect.pre(() => {
		selectedStatus = ticket.status;
	});

	const statusOptions = [
		{ value: 'open', label: 'Open' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'resolved', label: 'Resolved' },
		{ value: 'closed', label: 'Closed' }
	];

	let selectedPriority = $state('MEDIUM');

	$effect.pre(() => {
		selectedPriority = ticket.priority;
	});

	const priorityOptions = [
		{ label: 'Critical', value: 'CRITICAL' },
		{ label: 'High', value: 'HIGH' },
		{ label: 'Medium', value: 'MEDIUM' },
		{ label: 'Low', value: 'LOW' }
	];

	const statusEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;
			if (result.type === 'success') {
				toast.success('Status updated');
				await update();
			}
		};
	};

	const priorityEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;
			if (result.type === 'success') {
				toast.success('Priority updated — SLA recalculated');
				await update();
			}
		};
	};

	const statusHistories = $derived(ticket.statusHistories ?? []);
</script>

<div class="mx-auto max-w-(--breakpoint-2xl) p-4 pb-20 md:p-6 md:pb-6">
	<div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
		<!-- Left: Conversation Thread -->
		<div class="xl:col-span-8 2xl:col-span-9">
			<div
				class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
			>
				<!-- Header -->
				<div
					class="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800"
				>
					<div class="min-w-0">
						<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<span class="font-bold tracking-wider uppercase">Ticket #{ticket.ticketCode}</span>
						</div>
						<h3 class="truncate text-lg font-medium text-gray-800 dark:text-white/90">
							{ticket.title}
						</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{formatDate(ticket.createdAt)}
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<PriorityBadge priority={ticket.priority} />
						<StatusBadge status={ticket.status} />
					</div>
				</div>

				<!-- Conversation Thread -->
				<div
					class="custom-scrollbar space-y-6 divide-y divide-gray-200 overflow-y-auto px-6 py-7 dark:divide-gray-800"
					style="max-height: calc(58vh - 162px)"
				>
					<!-- Original report message -->
					<article class="pb-6">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div
									class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
								>
									{getInitials(ticket.reporter.fullName)}
								</div>
								<div>
									<p class="text-sm font-medium text-gray-800 dark:text-white/90">
										{ticket.reporter.fullName}
									</p>
									{#if ticket.reporter.username}
										<p class="text-xs text-gray-500 dark:text-gray-400">
											@{ticket.reporter.username}
										</p>
									{/if}
								</div>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								{formatDateTime(ticket.createdAt)}
							</p>
						</div>
						<div
							class="text-sm leading-relaxed whitespace-pre-wrap text-gray-500 dark:text-gray-400"
						>
							{ticket.body}
						</div>

						{#if ticket.attachments && ticket.attachments.length > 0}
							<div class="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
								<Paperclip class="size-4" />
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
												<Paperclip class="size-5 text-gray-400" />
												<span class="max-w-24 truncate text-xs text-gray-500">Download File</span>
											</div>
										{/if}
									</a>
								{/each}
							</div>
						{/if}
					</article>

					<!-- Status History entries as timeline updates -->
					{#each statusHistories as history (history.id)}
						<article class="pt-6">
							<div class="mb-4 flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div
										class="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400"
									>
										{getInitials(history.changedByUser?.name ?? 'System')}
									</div>
									<div>
										<p class="text-sm font-medium text-gray-800 dark:text-white/90">
											{history.changedByUser?.name ?? 'System Agent'}
										</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">Status Update</p>
									</div>
								</div>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									{formatDateTime(history.changedAt)}
								</p>
							</div>
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
									class="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
								>
									{history.note}
								</div>
							{/if}
						</article>
					{/each}
				</div>

				<!-- Reply Area (placeholder) -->
				<div class="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
					<div
						class="rounded-2xl border border-gray-200 shadow-xs dark:border-gray-800 dark:bg-gray-800"
					>
						<textarea
							placeholder="Type your reply here..."
							disabled
							class="h-20 w-full resize-none border-none bg-transparent p-5 font-normal text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
						></textarea>
						<div class="flex items-center justify-between p-3">
							<button
								disabled
								class="flex h-9 cursor-not-allowed items-center gap-1.5 rounded-lg bg-transparent px-2 py-3 text-sm text-gray-400 dark:text-gray-600"
							>
								<Paperclip class="size-5" />
								Attach
							</button>
							<button
								disabled
								class="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg bg-gray-300 px-4 py-3 text-sm font-medium text-white dark:bg-gray-700"
							>
								Reply
							</button>
						</div>
					</div>
				</div>

				<!-- Status Radio Buttons -->
				<div class="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
					<form method="POST" action="?/updateStatus" use:enhance={statusEnhance}>
						<input type="hidden" name="status" value={selectedStatus} />
						<input type="hidden" name="note" value="" />
						<div class="flex flex-wrap items-center gap-4">
							<span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
							<div class="flex items-center gap-5">
								{#each statusOptions as option (option.value)}
									<label
										class="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 select-none dark:text-gray-400"
									>
										<input
											type="radio"
											name="status_radio"
											value={option.value}
											bind:group={selectedStatus}
											class="sr-only"
										/>
										<div
											class="flex size-4 items-center justify-center rounded-full border-2 {selectedStatus ===
											option.value
												? 'border-primary'
												: 'border-gray-300 dark:border-gray-600'}"
										>
											{#if selectedStatus === option.value}
												<div class="size-2 rounded-full bg-primary"></div>
											{/if}
										</div>
										{option.label}
									</label>
								{/each}
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<Button type="submit" size="sm" disabled={selectedStatus === ticket.status}>
								<CheckCircle class="size-4" />
								Apply Status
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<!-- Right: Ticket Details Sidebar -->
		<div class="xl:col-span-4 2xl:col-span-3">
			<div
				class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
			>
				<div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
					<h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Ticket Details</h3>
				</div>
				<ul class="divide-y divide-gray-100 px-6 py-3 dark:divide-gray-800">
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Customer</span>
						<span class="text-right text-sm text-gray-700 dark:text-gray-400"
							>{ticket.reporter.fullName}</span
						>
					</li>
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Telegram</span>
						<a
							href="https://t.me/{ticket.reporter.username}"
							target="_blank"
							rel="external noopener noreferrer"
							class="inline-flex items-center gap-1 text-right text-sm text-primary hover:underline"
						>
							<TelegramLogoIcon class="size-3" />
							@{ticket.reporter.username}
						</a>
					</li>
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Ticket ID</span>
						<span class="text-right text-sm text-gray-700 dark:text-gray-400"
							>{ticket.ticketCode}</span
						>
					</li>
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Category</span>
						<span class="text-right text-sm text-gray-700 dark:text-gray-400"
							>{ticket.category?.name ?? 'Uncategorized'}</span
						>
					</li>
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Priority</span>
						<span class="text-right text-sm"><PriorityBadge priority={ticket.priority} /></span>
					</li>
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Created</span>
						<span class="text-right text-sm text-gray-700 dark:text-gray-400"
							>{formatDate(ticket.createdAt)}</span
						>
					</li>
					<li class="grid grid-cols-2 gap-4 py-2.5">
						<span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
						<div class="text-right"><StatusBadge status={ticket.status} /></div>
					</li>
				</ul>
			</div>

			<!-- Priority Form -->
			<div
				class="mt-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
			>
				<div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
					<h3 class="text-lg font-medium text-gray-800 dark:text-white/90">Priority & SLA</h3>
				</div>
				<div class="px-6 py-5">
					<form method="POST" action="?/updatePriority" use:enhance={priorityEnhance}>
						<input type="hidden" name="priority" value={selectedPriority} />
						<Select.Root type="single" bind:value={selectedPriority}>
							<Select.Trigger class="w-full">
								{priorityOptions.find((o) => o.value === selectedPriority)?.label ??
									'Select Priority'}
							</Select.Trigger>
							<Select.Content>
								{#each priorityOptions as option (option.value)}
									<Select.Item {...option} />
								{/each}
							</Select.Content>
						</Select.Root>
						<Button
							type="submit"
							class="mt-3 w-full"
							size="sm"
							disabled={selectedPriority === ticket.priority}
						>
							Update Priority
						</Button>
					</form>

					{#if ticket.slaResponseDue || ticket.slaResolveDue}
						<div class="mt-4 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
							{#if ticket.slaResponseDue}
								<div class="flex justify-between">
									<span>Response due:</span>
									<span class="font-medium">{new Date(ticket.slaResponseDue).toLocaleString()}</span
									>
								</div>
							{/if}
							{#if ticket.slaResolveDue}
								<div class="flex justify-between">
									<span>Resolve due:</span>
									<span class="font-medium">{new Date(ticket.slaResolveDue).toLocaleString()}</span>
								</div>
							{/if}
							{#if ticket.isSlaBreached}
								<div
									class="mt-2 rounded bg-red-50 p-2 text-center text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400"
								>
									SLA BREACHED
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
