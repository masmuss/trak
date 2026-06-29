<script lang="ts">
	import { resolve } from '$app/paths';
	import AppIcon from './app-icon.svelte';
</script>

<a href={resolve('/dashboard')} class="flex w-full items-center gap-2">
	<AppIcon />
	<span class="truncate text-base font-semibold group-data-[collapsible=icon]:hidden">Trak</span>
</a>
