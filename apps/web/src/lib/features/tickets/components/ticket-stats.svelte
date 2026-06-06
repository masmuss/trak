<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	type StatItem = {
		value: number;
		label: string;
		icon: any;
		color: string;
	};

	let {
		items = []
	}: {
		items: StatItem[];
	} = $props();
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
	{#each items as item (item.label)}
		<Card.Root size="sm" class="flex-row items-center gap-5 px-5 py-4">
			<div
				class="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-md {item.color}"
			>
				<item.icon class="size-7" />
			</div>
			<Card.Content class="flex flex-col justify-center gap-0 px-0 py-0">
				<span class="text-title-xs font-semibold text-gray-800 dark:text-white/90">
					{item.value.toLocaleString()}
				</span>
				<span class="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
