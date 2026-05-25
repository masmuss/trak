<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	type Stats = {
		totalReports: number;
		openTickets: number;
		activeReporters: number;
		inviteCodesUsed: number;
	};

	let { stats }: { stats: Stats } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Total Reports</Card.Title>
		<Card.Action>
			<Badge variant="default">+12.5%</Badge>
		</Card.Action>
	</Card.Header>
	<Card.Content class="text-2xl font-semibold">
		{stats.totalReports.toLocaleString()}
	</Card.Content>
</Card.Root>
<Card.Root>
	<Card.Header>
		<Card.Title>Open Tickets</Card.Title>
		<Card.Action>
			<Badge variant="destructive">
				{stats.openTickets > 50 ? 'High volume' : stats.openTickets > 20 ? 'Moderate' : 'Low'}
			</Badge>
		</Card.Action>
	</Card.Header>
	<Card.Content class="text-2xl font-semibold">
		{stats.openTickets.toLocaleString()}
	</Card.Content>
</Card.Root>
<Card.Root>
	<Card.Header>
		<Card.Title>Active Reporters</Card.Title>
		<Card.Action>
			<Badge variant="secondary">
				{stats.activeReporters > 100 ? 'Growing' : 'Stable'}
			</Badge>
		</Card.Action>
	</Card.Header>
	<Card.Content class="text-2xl font-semibold">
		{stats.activeReporters.toLocaleString()}
	</Card.Content>
</Card.Root>
<Card.Root>
	<Card.Header>
		<Card.Title>Invite Codes Active</Card.Title>
		<Card.Action>
			<Badge variant="outline">{Math.min(100, stats.inviteCodesUsed)} Active</Badge>
		</Card.Action>
	</Card.Header>
	<Card.Content class="text-2xl font-semibold">
		{stats.inviteCodesUsed.toLocaleString()}
	</Card.Content>
</Card.Root>
