<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import type { PageData } from './$types';
	import DashboardStats from '$lib/features/dashboard/components/dashboard-stats.svelte';
	import DashboardReportsTable from '$lib/features/dashboard/components/dashboard-reports-table.svelte';
	import DashboardInviteCodes from '$lib/features/dashboard/components/dashboard-invite-codes.svelte';
	import DashboardResponseTime from '$lib/features/dashboard/components/dashboard-response-time.svelte';
	import DashboardSatisfaction from '$lib/features/dashboard/components/dashboard-satisfaction.svelte';

	let { data }: { data: PageData } = $props();
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
		<DashboardStats stats={data.stats} />
	</div>

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
		<div class="xl:col-span-2">
			<DashboardReportsTable reports={data.recentReports} />
		</div>
		<div>
			<DashboardInviteCodes inviteCodes={data.inviteCodes} />
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<DashboardResponseTime />
		<DashboardSatisfaction />
	</div>
</div>
