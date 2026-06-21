<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import type { PageData } from './$types';
	import DashboardStats from '$lib/features/dashboard/components/dashboard-stats.svelte';
	import DashboardReportsTable from '$lib/features/dashboard/components/dashboard-reports-table.svelte';
	import DashboardInviteCodes from '$lib/features/dashboard/components/dashboard-invite-codes.svelte';
	import DashboardResponseTime from '$lib/features/dashboard/components/dashboard-response-time.svelte';
	import DashboardCriticalTickets from '$lib/features/dashboard/components/dashboard-critical-tickets.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Heading
		title="Dashboard Overview"
		description="Performance metrics and ticketing activity for the last 30 days."
	/>

	<DashboardStats stats={data.stats} />

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
		<div class="xl:col-span-2">
			<DashboardReportsTable reports={data.recentReports} />
		</div>
		<div>
			<DashboardInviteCodes inviteCodes={data.inviteCodes} />
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
		<div class="xl:col-span-2">
			<DashboardResponseTime overview={data.performanceOverview} />
		</div>
		<div>
			<DashboardCriticalTickets criticalReports={data.criticalReports} />
		</div>
	</div>
</div>
