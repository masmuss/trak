<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Ticket Details</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<Heading title="Ticket Details" description="View details of this support report." />
	<div class="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
		Details page for ticket ID: {data.id || 'Unknown'}
	</div>
</div>
