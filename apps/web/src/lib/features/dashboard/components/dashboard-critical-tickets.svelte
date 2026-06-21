<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { WarningCircleIcon, ArrowRightIcon } from 'phosphor-svelte';
	import type { TicketWithRelations } from '@trak/shared';
	import SlaBadge from '$lib/features/tickets/components/sla-badge.svelte';
	import PriorityBadge from '$lib/features/tickets/components/priority-badge.svelte';
	import { resolve } from '$app/paths';

	let { criticalReports = [] }: { criticalReports?: TicketWithRelations[] } = $props();
</script>

<Card.Root class="h-full">
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title>Action Needed</Card.Title>
			<Button variant="outline" size="sm" href="/tickets?priority=CRITICAL">
				View all
				<ArrowRightIcon class="ml-1 size-3" />
			</Button>
		</div>
		<Card.Description>Tickets that are breached or critical priority</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-4">
			{#if criticalReports.length === 0}
				<div
					class="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground"
				>
					<WarningCircleIcon class="size-6 text-muted-foreground/50" />
					<p class="text-sm">No critical tickets pending!</p>
				</div>
			{:else}
				<ScrollArea class="h-73.75 pr-4">
					<div class="relative">
						<div class="absolute inset-y-0 left-5.75 w-px bg-border/80"></div>
						<div class="flex flex-col gap-5">
							{#each criticalReports as report (report.id)}
								<div class="relative flex items-start gap-4">
									<div
										class="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-background bg-muted text-muted-foreground shadow-sm"
									>
										<div
											class="flex size-9 items-center justify-center rounded-full bg-background text-destructive"
										>
											<WarningCircleIcon class="size-5" />
										</div>
									</div>
									<div class="flex flex-col gap-1.5 pt-1.5">
										<a
											href={resolve(`/tickets/${report.id}`)}
											class="text-sm leading-none font-medium hover:underline"
										>
											{report.title}
										</a>
										<div class="flex items-center gap-2 text-xs text-muted-foreground">
											<span class="max-w-30 truncate">{report.ticketCode}</span>
											<span class="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
											<span class="truncate">{report.reporter?.fullName || 'Anonymous'}</span>
										</div>
										<div class="mt-1 flex flex-wrap gap-2">
											<PriorityBadge priority={report.priority} />
											<SlaBadge
												isSlaBreached={report.isSlaBreached}
												slaResolveDue={report.slaResolveDue}
											/>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</ScrollArea>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
