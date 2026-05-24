<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/features/tickets/components/status-badge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PageData } from './$types';
	import {
		ArrowLeftIcon,
		CalendarIcon,
		UserIcon,
		PaperclipIcon,
		ClockIcon,
		ChatIcon,
		ArchiveIcon,
		TagIcon,
		TelegramLogoIcon
	} from 'phosphor-svelte';

	let { data }: { data: PageData } = $props();

	const ticket = $derived(data.ticket);
	const statusHistories = $derived(ticket?.statusHistories ?? []);

	let selectedStatus = $state('open');
	let noteText = $state('');

	$effect.pre(() => {
		if (ticket) {
			selectedStatus = ticket.status;
		}
	});

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];

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

<svelte:head>
	<title>Ticket Details - {ticket?.title ?? 'Incident'}</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-6 p-6 pt-2">
	<!-- Top navigation & back link -->
	<div>
		<a
			href={resolve('/tickets')}
			class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeftIcon class="size-4" />
			Back to Tickets List
		</a>
	</div>

	{#if ticket}
		<!-- Header details -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
						Ticket ID: #{ticket.id.slice(0, 8)}
					</span>
					<Separator orientation="vertical" class="h-3" />
					<span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
						<TagIcon class="size-3" />
						{ticket.category?.name ?? 'Uncategorized'}
					</span>
				</div>
				<h1 class="text-2xl font-bold tracking-tight md:text-3xl">{ticket.title}</h1>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm text-muted-foreground">Current Status:</span>
				<StatusBadge status={ticket.status} />
			</div>
		</div>

		<Separator />

		<!-- Main content grid -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Left column: Ticket Info and Timeline -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Ticket Body -->
				<div class="rounded-xl border bg-card text-card-foreground shadow-xs">
					<div class="flex flex-col gap-1.5 border-b p-6">
						<h3 class="text-lg leading-none font-semibold tracking-tight">Incident Description</h3>
						<p class="text-sm text-muted-foreground">
							Detailed description submitted by the reporter.
						</p>
					</div>
					<div class="p-6">
						<p class="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{ticket.body}</p>
					</div>

					{#if ticket.attachments && ticket.attachments.length > 0}
						<Separator />
						<div class="p-6">
							<h4 class="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
								<PaperclipIcon class="size-4" />
								Attachments ({ticket.attachments.length})
							</h4>
							<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
								{#each ticket.attachments as attachment (attachment.id)}
									<a
										href={attachment.storageUrl}
										target="_blank"
										rel="external noopener noreferrer"
										class="group relative flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
									>
										{#if attachment.fileType.startsWith('image/')}
											<img
												src={attachment.storageUrl}
												alt="Attachment"
												class="max-h-24 rounded-md object-contain"
											/>
										{:else}
											<div
												class="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
											>
												<PaperclipIcon class="size-6" />
											</div>
											<span
												class="w-full truncate text-center text-xs font-medium text-muted-foreground group-hover:text-foreground"
											>
												Download File
											</span>
										{/if}
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- Incident Timeline -->
				<div class="rounded-xl border bg-card text-card-foreground shadow-xs">
					<div class="flex flex-col gap-1.5 border-b p-6">
						<h3 class="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
							<ChatIcon class="size-5 text-muted-foreground" />
							Activity Log & Timeline
						</h3>
						<p class="text-sm text-muted-foreground">
							Historical records of status transitions and agent notes.
						</p>
					</div>
					<div class="p-6">
						{#if statusHistories.length === 0}
							<div class="flex flex-col items-center justify-center py-8 text-center">
								<div
									class="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
								>
									<ClockIcon class="size-5" />
								</div>
								<p class="text-sm font-medium text-muted-foreground">
									No status modifications logged yet.
								</p>
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
											class="absolute top-1.5 left-[-33px] flex size-4 items-center justify-center rounded-full border-2 border-primary bg-background"
										>
											<div class="size-1.5 rounded-full bg-primary"></div>
										</div>

										<!-- Log card -->
										<div class="flex flex-col gap-1">
											<div class="flex flex-wrap items-center gap-2 text-sm">
												<span class="font-semibold text-foreground">
													{history.changedByUser?.name ?? 'System Agent'}
												</span>
												<span class="text-xs text-muted-foreground">
													transitioned status from
												</span>
												<StatusBadge status={history.oldStatus} />
												<span class="text-xs text-muted-foreground">to</span>
												<StatusBadge status={history.newStatus} />
											</div>
											<span class="flex items-center gap-1 text-xs text-muted-foreground">
												<ClockIcon class="size-3" />
												{formatDate(history.changedAt)}
											</span>
											{#if history.note}
												<div
													class="mt-2 rounded-lg border-l-2 border-muted-foreground/30 bg-muted/50 p-3 text-sm text-foreground italic"
												>
													"{history.note}"
												</div>
											{/if}
										</div>
									</div>
								{/each}

								<!-- Initial creation timeline point -->
								<div class="relative">
									<div
										class="absolute top-1.5 left-[-33px] flex size-4 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background"
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
					</div>
				</div>
			</div>

			<!-- Right column: Metadata and Form Actions -->
			<div class="space-y-6">
				<!-- Quick Actions Form -->
				<div class="rounded-xl border bg-card text-card-foreground shadow-xs">
					<div class="flex flex-col gap-1.5 border-b p-6">
						<h3 class="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
							<ArchiveIcon class="size-5 text-muted-foreground" />
							Transition Status
						</h3>
						<p class="text-sm text-muted-foreground">Update state and document actions.</p>
					</div>
					<div class="p-6">
						<form
							method="POST"
							action="?/updateStatus"
							use:enhance={() => {
								return ({ result }) => {
									if (result.type === 'success') {
										noteText = '';
									}
								};
							}}
							class="space-y-4"
						>
							<div class="space-y-1.5">
								<label for="status" class="text-sm font-medium text-foreground"
									>Select New Status</label
								>
								<Select.Root allowDeselect={false} type="single" bind:value={selectedStatus}>
									<Select.Trigger class="h-10 w-full text-sm">
										{statusOptions.find((o) => o.value === selectedStatus)?.label ??
											'Select Status'}
									</Select.Trigger>
									<Select.Content>
										{#each statusOptions as option (option.value)}
											<Select.Item value={option.value} class="text-sm">
												{option.label}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<input type="hidden" name="status" value={selectedStatus} />
							</div>

							<div class="space-y-1.5">
								<label for="note" class="text-sm font-medium text-foreground"
									>Status Note (Optional)</label
								>
								<Textarea
									id="note"
									name="note"
									placeholder="Add details about why status changed..."
									bind:value={noteText}
									class="min-h-24 text-sm"
								/>
							</div>

							<Button
								type="submit"
								class="w-full text-sm font-semibold"
								disabled={selectedStatus === ticket.status}
							>
								Apply Transition
							</Button>
						</form>
					</div>
				</div>

				<!-- Reporter Details & Meta Info -->
				<div class="rounded-xl border bg-card text-card-foreground shadow-xs">
					<div class="flex flex-col gap-1.5 border-b p-6">
						<h3 class="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
							<UserIcon class="size-5 text-muted-foreground" />
							Reporter Profile
						</h3>
						<p class="text-sm text-muted-foreground">Information about the incident reporter.</p>
					</div>
					<div class="space-y-4 p-6">
						<div class="flex items-center gap-3">
							<div
								class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
							>
								{getInitials(ticket.reporter.fullName)}
							</div>
							<div class="min-w-0">
								<h4 class="truncate text-sm font-semibold text-foreground">
									{ticket.reporter.fullName}
								</h4>
								{#if ticket.reporter.username}
									<a
										href="https://t.me/{ticket.reporter.username}"
										target="_blank"
										rel="noopener noreferrer"
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
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
			Unable to load ticket details. Please try again.
		</div>
	{/if}
</div>
