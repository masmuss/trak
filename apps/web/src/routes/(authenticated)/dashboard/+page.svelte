<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import type { PageData } from './$types';
	import DashboardStats from '$lib/features/dashboard/components/dashboard-stats.svelte';
	import DashboardReportsTable from '$lib/features/dashboard/components/dashboard-reports-table.svelte';
	import DashboardInviteCodes from '$lib/features/dashboard/components/dashboard-invite-codes.svelte';
	import DashboardResponseTime from '$lib/features/dashboard/components/dashboard-response-time.svelte';
	import DashboardCriticalTickets from '$lib/features/dashboard/components/dashboard-critical-tickets.svelte';
	import DashboardVolume from '$lib/features/dashboard/components/dashboard-volume.svelte';
	import DashboardSlaCalendar from '$lib/features/dashboard/components/dashboard-sla-calendar.svelte';
	import CategoryDistribution from '$lib/features/settings/components/settings-category-distribution.svelte';

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

	<DashboardStats stats={data.stats} trend={data.trend} />

	<div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
		<div class="flex min-w-0 flex-col gap-4 md:gap-6 xl:col-span-2">
			<DashboardVolume volume={data.volume} />
			<DashboardReportsTable reports={data.recentReports} />
			<DashboardResponseTime overview={data.performanceOverview} />
		</div>
		<div class="flex min-w-0 flex-col gap-4 md:gap-6">
			<CategoryDistribution distribution={data.distribution} uncategorized={data.uncategorized} />
			<DashboardCriticalTickets criticalReports={data.criticalReports} />
			<DashboardInviteCodes inviteCodes={data.inviteCodes} />
		</div>
	</div>

	<DashboardSlaCalendar />
</div>
