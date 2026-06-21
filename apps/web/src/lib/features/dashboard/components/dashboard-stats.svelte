<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowUpRightIcon, TrendUpIcon, TrendDownIcon } from 'phosphor-svelte';

	type Stats = {
		totalReports: number;
		openTickets: number;
		slaBreachedTickets: number;
		criticalTickets: number;
	};

	let { stats }: { stats: Stats } = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Description>Total Tickets</Card.Description>
			<ArrowUpRightIcon class="size-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-3xl leading-none tracking-tight tabular-nums">
					{stats.totalReports.toLocaleString()}
				</span>
				<Badge
					variant="outline"
					class="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
				>
					<TrendUpIcon class="mr-1 size-3" />
					+12%
				</Badge>
			</div>
			<p class="text-sm">
				<span class="font-medium text-foreground">Total</span>
				<span class="text-muted-foreground">tickets received</span>
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Description>Open Tickets</Card.Description>
			<ArrowUpRightIcon class="size-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-3xl leading-none tracking-tight tabular-nums">
					{stats.openTickets.toLocaleString()}
				</span>
				<Badge variant="outline" class="border-destructive/20 bg-destructive/10 text-destructive">
					<TrendDownIcon class="mr-1 size-3" />
					Needs Action
				</Badge>
			</div>
			<p class="text-sm">
				<span class="font-medium text-foreground">{stats.openTickets}</span>
				<span class="text-muted-foreground">awaiting response</span>
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Description>SLA Breached</Card.Description>
			<ArrowUpRightIcon class="size-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-3xl leading-none tracking-tight tabular-nums">
					{stats.slaBreachedTickets.toLocaleString()}
				</span>
				<Badge variant="outline" class="border-destructive/20 bg-destructive/10 text-destructive">
					<TrendUpIcon class="mr-1 size-3" />
					High Priority
				</Badge>
			</div>
			<p class="text-sm">
				<span class="font-medium text-foreground">{stats.slaBreachedTickets}</span>
				<span class="text-muted-foreground">tickets overdue</span>
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Description>Critical Priority</Card.Description>
			<ArrowUpRightIcon class="size-4 text-muted-foreground" />
		</Card.Header>
		<Card.Content class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-3xl leading-none tracking-tight tabular-nums">
					{stats.criticalTickets.toLocaleString()}
				</span>
				<Badge
					variant="outline"
					class="border-orange-200 bg-orange-500/10 text-orange-700 dark:border-orange-900/40 dark:bg-orange-500/15 dark:text-orange-300"
				>
					<TrendUpIcon class="mr-1 size-3" />
					Urgent
				</Badge>
			</div>
			<p class="text-sm">
				<span class="font-medium text-foreground">{stats.criticalTickets}</span>
				<span class="text-muted-foreground">critical tickets</span>
			</p>
		</Card.Content>
	</Card.Root>
</div>
