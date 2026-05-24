<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import type { PageData } from './$types';
	import ReportersTable from '$lib/features/reporter/components/reporters-table.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Reporters</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading
			title="Reporters"
			description="View all Telegram reporters who have submitted tickets."
		/>
	</div>

	<ReportersTable reporters={data.reporters} />
</div>
