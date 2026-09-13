<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import AuditLogsFilter from '$lib/features/audit-logs/components/audit-logs-filter.svelte';
	import AuditLogsTable from '$lib/features/audit-logs/components/audit-logs-table.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Audit Logs</title>
</svelte:head>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Heading title="Audit Logs" description="Review administrative and ticket activity." />

	<AuditLogsFilter filters={data.filters} />

	<AuditLogsTable logs={data.logs} />
</div>
