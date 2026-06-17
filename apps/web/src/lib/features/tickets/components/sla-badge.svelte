<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { WarningCircleIcon, ClockIcon, CheckCircleIcon, ProhibitIcon } from 'phosphor-svelte';
	import type { Component } from 'svelte';

	let {
		isSlaBreached,
		slaResolveDue,
		status = 'open'
	}: {
		isSlaBreached: boolean;
		slaResolveDue: string | Date | null;
		status?: string;
	} = $props();

	const state = $derived.by(() => {
		if (!slaResolveDue) return 'no_sla';
		if (isSlaBreached) return 'breached';

		// If ticket is already resolved/closed and wasn't breached, it means SLA was met.
		if (status === 'resolved' || status === 'closed') return 'met';

		const now = new Date();
		const due = new Date(slaResolveDue);
		const diffMs = due.getTime() - now.getTime();
		const diffHours = diffMs / (1000 * 60 * 60);

		// If within 2 hours of deadline, show warning
		if (diffHours <= 2) {
			return 'warning';
		}
		return 'on_track';
	});

	const slaConfig: Record<
		string,
		{
			class: string;
			label: string;
			icon: Component;
		}
	> = {
		breached: {
			class:
				'bg-red-50 text-red-700 border-red-200 hover:bg-red-50/80 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900',
			label: 'Breached',
			icon: WarningCircleIcon as Component
		},
		warning: {
			class:
				'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50/80 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900',
			label: 'At Risk',
			icon: ClockIcon as Component
		},
		on_track: {
			class:
				'bg-green-50 text-green-700 border-green-200 hover:bg-green-50/80 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900',
			label: 'On Track',
			icon: CheckCircleIcon as Component
		},
		met: {
			class:
				'bg-green-50 text-green-700 border-green-200 hover:bg-green-50/80 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900',
			label: 'Met SLA',
			icon: CheckCircleIcon as Component
		},
		no_sla: {
			class:
				'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50/80 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900',
			label: 'No SLA',
			icon: ProhibitIcon as Component
		}
	};

	const config = $derived(slaConfig[state]);
</script>

<Badge variant="outline" class={config.class}>
	{@const Icon = config.icon}
	<Icon class="size-3" />
	{config.label}
</Badge>
