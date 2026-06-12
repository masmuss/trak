<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<div class="space-y-4">
	{#if children}
		{@render children()}
	{/if}
</div>
