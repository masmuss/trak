<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Heading from '$lib/components/shared/heading.svelte';
	import AuditLogsFilter from '$lib/features/audit-logs/components/audit-logs-filter.svelte';
	import AuditLogsTable from '$lib/features/audit-logs/components/audit-logs-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function pageHref(target: number): string {
		const params = new SvelteURLSearchParams();
		if (data.filters.action) params.set('action', data.filters.action);
		if (data.filters.entityType) params.set('entityType', data.filters.entityType);
		if (data.filters.search) params.set('search', data.filters.search);
		if (data.filters.from) params.set('from', data.filters.from);
		if (data.filters.to) params.set('to', data.filters.to);
		params.set('page', String(target));
		return `?${params.toString()}`;
	}
</script>

<svelte:head>
	<title>Audit Logs</title>
</svelte:head>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Heading title="Audit Logs" description="Review administrative and ticket activity." />

	<AuditLogsFilter filters={data.filters} />

	<AuditLogsTable logs={data.logs} />

	<div class="flex items-center justify-between text-sm text-muted-foreground">
		<span>
			Page {data.page} of {data.pageCount} · {data.total} entries
		</span>
		<div class="flex gap-2">
			<Button variant="outline" size="sm" href={pageHref(data.page - 1)} disabled={data.page <= 1}>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				href={pageHref(data.page + 1)}
				disabled={data.page >= data.pageCount}
			>
				Next
			</Button>
		</div>
	</div>
</div>
