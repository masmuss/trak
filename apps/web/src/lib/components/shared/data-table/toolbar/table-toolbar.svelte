<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<div class="flex w-full flex-row items-center justify-between gap-4">
	{#if children}
		{@render children()}
	{/if}
</div>
