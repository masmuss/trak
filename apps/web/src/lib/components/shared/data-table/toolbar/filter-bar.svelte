<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { XIcon } from 'phosphor-svelte';
	import FilterDropdown from './filter-dropdown.svelte';
	import type { SelectFilterConfig } from '../types';

	let {
		configs,
		selectedValues,
		onSelect,
		onClearFilter,
		onClearAll,
		hasActiveFilters
	}: {
		configs: SelectFilterConfig[];
		selectedValues: Record<string, Set<string>>;
		onSelect?: (key: string, value: string) => void;
		onClearFilter?: (key: string) => void;
		onClearAll?: () => void;
		hasActiveFilters?: boolean;
	} = $props();
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each configs as config (config.key)}
		<FilterDropdown
			title={config.title}
			{config}
			selectedValues={selectedValues[config.key] || new Set()}
			onSelect={(value) => onSelect?.(config.key, value)}
			onClear={() => onClearFilter?.(config.key)}
		/>
	{/each}
	{#if hasActiveFilters}
		<Button variant="ghost" onclick={onClearAll} class="px-2 lg:px-3">
			Reset
			<XIcon class="ms-2 size-4" />
		</Button>
	{/if}
</div>
