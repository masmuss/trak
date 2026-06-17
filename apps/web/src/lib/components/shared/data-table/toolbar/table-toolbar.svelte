<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
	{#if children}
		{@render children()}
	{/if}
</div>
