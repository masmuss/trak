<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { TicketIcon, WarningCircleIcon, UsersIcon, KeyIcon } from 'phosphor-svelte';

	type Stats = {
		totalReports: number;
		openTickets: number;
		activeReporters: number;
		inviteCodesUsed: number;
	};

	let { stats }: { stats: Stats } = $props();
</script>

<div
	class="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card"
>
	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div
					class="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
				>
					<TicketIcon class="size-4" />
				</div>
			</Card.Title>
			<Card.Description>Total Reports</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<div class="flex flex-wrap items-center gap-2">
				<div class="text-3xl leading-none font-medium tracking-tight tabular-nums">
					{stats.totalReports.toLocaleString()}
				</div>
				<Badge>+12.5%</Badge>
			</div>
			<p class="text-sm text-muted-foreground">Total reports submitted</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div
					class="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
				>
					<WarningCircleIcon class="size-4" />
				</div>
			</Card.Title>
			<Card.Description>Open Tickets</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<div class="flex flex-wrap items-center gap-2">
				<div class="text-3xl leading-none font-medium tracking-tight tabular-nums">
					{stats.openTickets.toLocaleString()}
				</div>
				<Badge variant="destructive">
					{stats.openTickets > 50 ? 'High volume' : stats.openTickets > 20 ? 'Moderate' : 'Low'}
				</Badge>
			</div>
			<p class="text-sm text-muted-foreground">Tickets requiring attention</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div
					class="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
				>
					<UsersIcon class="size-4" />
				</div>
			</Card.Title>
			<Card.Description>Active Reporters</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<div class="flex flex-wrap items-center gap-2">
				<div class="text-3xl leading-none font-medium tracking-tight tabular-nums">
					{stats.activeReporters.toLocaleString()}
				</div>
				<Badge variant="secondary">
					{stats.activeReporters > 100 ? 'Growing' : 'Stable'}
				</Badge>
			</div>
			<p class="text-sm text-muted-foreground">Users submitting reports</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>
				<div
					class="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground"
				>
					<KeyIcon class="size-4" />
				</div>
			</Card.Title>
			<Card.Description>Invite Codes Used</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<div class="flex flex-wrap items-center gap-2">
				<div class="text-3xl leading-none font-medium tracking-tight tabular-nums">
					{stats.inviteCodesUsed.toLocaleString()}
				</div>
				<Badge variant="outline">
					{Math.min(100, stats.inviteCodesUsed)} Active
				</Badge>
			</div>
			<p class="text-sm text-muted-foreground">Total codes redeemed</p>
		</Card.Content>
	</Card.Root>
</div>
