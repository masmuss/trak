<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { CircleIcon, ClockClockwiseIcon, CheckCircleIcon, ArchiveIcon } from 'phosphor-svelte';
	import type { Component } from 'svelte';

	let {
		status
	}: {
		status: string;
	} = $props();

	const statusConfig: Record<
		string,
		{
			class: string;
			label: string;
			icon: Component;
		}
	> = {
		open: {
			class:
				'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50/80 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900',
			label: 'Open',
			icon: CircleIcon as Component
		},
		in_progress: {
			class:
				'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
			label: 'In Progress',
			icon: ClockClockwiseIcon as Component
		},
		resolved: {
			class:
				'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900',
			label: 'Resolved',
			icon: CheckCircleIcon as Component
		},
		closed: {
			class:
				'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-50/80 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-900',
			label: 'Closed',
			icon: ArchiveIcon as Component
		}
	};

	const config = $derived(statusConfig[status] || statusConfig.open);
</script>

<Badge variant="outline" class={config.class}>
	{@const Icon = config.icon}
	<Icon class="size-3" />
	{config.label}
</Badge>
