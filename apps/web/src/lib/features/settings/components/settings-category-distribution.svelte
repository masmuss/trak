<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	type DistItem = {
		categoryId: string;
		categoryName: string;
		count: number;
		percentage: number;
	};

	let {
		distribution,
		uncategorized = 0
	}: {
		distribution: DistItem[];
		uncategorized: number;
	} = $props();

	const barColors = [
		'bg-primary',
		'bg-purple-500',
		'bg-amber-500',
		'bg-green-500',
		'bg-pink-500',
		'bg-cyan-500',
		'bg-red-500',
		'bg-indigo-500'
	];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Category Distribution</Card.Title>
		<Card.Description>Distribution of tickets across categories.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-4">
			{#each distribution as item, i (item.categoryId)}
				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-muted-foreground">{item.categoryName}</span>
						<span class="font-medium">{item.count} ({item.percentage}%)</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
						<div
							class="{barColors[i % barColors.length]} h-full rounded-full"
							style="width: {item.percentage}%"
						></div>
					</div>
				</div>
			{/each}
			{#if uncategorized > 0}
				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-muted-foreground">Uncategorized</span>
						<span class="font-medium">{uncategorized}</span>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
						<div class="h-full rounded-full bg-muted-foreground/30" style="width: 100%"></div>
					</div>
				</div>
			{/if}
		</div>
		{#if distribution.length === 0 && uncategorized === 0}
			<p class="py-6 text-center text-xs text-muted-foreground">No tickets yet.</p>
		{/if}
	</Card.Content>
</Card.Root>
