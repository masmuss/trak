<script lang="ts">
	import { MagnifyingGlassIcon, XIcon } from 'phosphor-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		value = $bindable(),
		placeholder = 'Search...',
		onClear,
		onKeyDown
	}: {
		value?: string;
		placeholder?: string;
		onClear?: () => void;
		onKeyDown?: (e: KeyboardEvent) => void;
	} = $props();
</script>

<div class="relative w-full lg:w-80">
	<MagnifyingGlassIcon
		class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
	/>
	<Input
		bind:value
		{placeholder}
		onkeydown={onKeyDown}
		class="h-8 rounded-[min(var(--radius-md),12px)] pl-8"
	/>
	{#if value}
		<Button
			variant="ghost"
			size="sm"
			class="absolute top-1/2 right-1 size-6 -translate-y-1/2 p-0 hover:bg-muted"
			onclick={onClear}
		>
			<XIcon class="size-3" />
		</Button>
	{/if}
</div>
