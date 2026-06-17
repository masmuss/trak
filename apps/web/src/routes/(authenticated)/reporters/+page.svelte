<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import ReportersTable from '$lib/features/reporter/components/reporters-table.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Reporters</title>
</svelte:head>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Card.Root>
		<Card.Header>
			<div>
				<Card.Title>Reporters</Card.Title>
				<Card.Description>View all Telegram reporters who have submitted tickets.</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<ReportersTable reporters={data.reporters} />
		</Card.Content>
	</Card.Root>
</div>
