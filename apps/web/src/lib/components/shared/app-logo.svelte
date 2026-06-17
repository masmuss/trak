<script lang="ts">
	import { CommandIcon } from 'phosphor-svelte';
	import { resolve } from '$app/paths';
</script>

<a href={resolve('/dashboard')} class="flex w-full items-center gap-2 px-1">
	<CommandIcon class="size-5 shrink-0" />
	<span class="truncate text-base font-semibold">Trak</span>
</a>
