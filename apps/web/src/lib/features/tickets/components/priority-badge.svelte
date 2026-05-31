<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { FlagIcon, WarningCircleIcon, WarningIcon, CircleIcon } from 'phosphor-svelte';
	import type { Component } from 'svelte';

	let {
		priority
	}: {
		priority: string;
	} = $props();

	const priorityConfig: Record<
		string,
		{
			class: string;
			label: string;
			icon: Component;
		}
	> = {
		CRITICAL: {
			class:
				'bg-red-50 text-red-700 border-red-200 hover:bg-red-50/80 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900',
			label: 'Critical',
			icon: WarningCircleIcon as Component
		},
		HIGH: {
			class:
				'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50/80 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900',
			label: 'High',
			icon: WarningIcon as Component
		},
		MEDIUM: {
			class:
				'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50/80 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900',
			label: 'Medium',
			icon: CircleIcon as Component
		},
		LOW: {
			class:
				'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50/80 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900',
			label: 'Low',
			icon: FlagIcon as Component
		}
	};

	const config = $derived(priorityConfig[priority] || priorityConfig.MEDIUM);
</script>

<Badge variant="outline" class={config.class}>
	{@const Icon = config.icon}
	<Icon class="size-3" />
	{config.label}
</Badge>
