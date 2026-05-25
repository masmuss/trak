<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import DashboardReportsTable from '$lib/features/dashboard/components/dashboard-reports-table.svelte';
	import DashboardInviteCodes from '$lib/features/dashboard/components/dashboard-invite-codes.svelte';
	import DashboardResponseTime from '$lib/features/dashboard/components/dashboard-response-time.svelte';
	import DashboardSatisfaction from '$lib/features/dashboard/components/dashboard-satisfaction.svelte';
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<Heading
		title="Dashboard Overview"
		description="Performance metrics and ticketing activity for the last 30 days."
	/>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Total Reports</Card.Title>
				<Card.Action>
					<Badge variant="default">+12.5%</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">2,482</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Open Tickets</Card.Title>
				<Card.Action>
					<Badge variant="destructive">High volume</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">42</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Active Reporters</Card.Title>
				<Card.Action>
					<Badge variant="secondary">Stable</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">156</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Invite Codes Used</Card.Title>
				<Card.Action>
					<Badge variant="outline">84% Capacity</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="text-2xl font-semibold">1,024</Card.Content>
		</Card.Root>
	</div>

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
		<div class="xl:col-span-2">
			<DashboardReportsTable />
		</div>
		<div>
			<DashboardInviteCodes />
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DashboardResponseTime />
		<DashboardSatisfaction />
	</div>
</div>
