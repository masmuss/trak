<script lang="ts">
	import type { Component } from 'svelte';
	import * as Card from '$lib/components/ui/card';

	type StatItem = {
		value: number;
		label: string;
		icon: Component<{ class?: string }>;
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
			<div class="flex flex-col justify-center">
				<span class="text-xl font-semibold">
					{item.value.toLocaleString()}
				</span>
				<span class="text-sm text-muted-foreground">
					{item.label}
				</span>
			</div>
		</Card.Root>
	{/each}
</div>
