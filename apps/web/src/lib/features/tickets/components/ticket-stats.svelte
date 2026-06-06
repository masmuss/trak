<script lang="ts">
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
		<article
			class="flex gap-5 rounded-xl border border-gray-200 bg-card p-4 shadow-xs dark:border-gray-800"
		>
			<div class="inline-flex h-14 w-14 items-center justify-center rounded-xl {item.color}">
				<item.icon class="size-7" />
			</div>
			<div class="flex flex-col justify-center">
				<span class="text-title-xs font-semibold text-gray-800 dark:text-white/90">
					{item.value.toLocaleString()}
				</span>
				<span class="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
			</div>
		</article>
	{/each}
</div>
