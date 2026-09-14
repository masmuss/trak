<script lang="ts">
	import { goto } from '$app/navigation';
	import { SvelteMap } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';

	interface Deadline {
		id: string;
		ticketCode: string;
		title: string;
		priority: string;
		status: string;
		slaResolveDue: string | Date;
		isSlaBreached: boolean;
	}

	const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	const DOT_CLASS: Record<string, string> = {
		CRITICAL: 'bg-red-500',
		HIGH: 'bg-orange-500',
		MEDIUM: 'bg-yellow-500',
		LOW: 'bg-slate-400'
	};

	const today = new Date();
	let year = $state(today.getFullYear());
	let month = $state(today.getMonth());
	let deadlines = $state<Deadline[]>([]);
	let overdue = $state<Deadline[]>([]);
	let loading = $state(true);

	const monthLabel = $derived(
		new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);

	const cells = $derived.by(() => {
		const first = new Date(year, month, 1);
		const leadBlanks = (first.getDay() + 6) % 7;
		const dayCount = new Date(year, month + 1, 0).getDate();
		const byDay = new SvelteMap<number, Deadline[]>();
		for (const d of deadlines) {
			const date = new Date(d.slaResolveDue);
			if (date.getFullYear() !== year || date.getMonth() !== month) continue;
			const list = byDay.get(date.getDate()) ?? [];
			list.push(d);
			byDay.set(date.getDate(), list);
		}
		const list: ({ day: number } | null)[] = Array.from({ length: leadBlanks }, () => null);
		for (let day = 1; day <= dayCount; day++) list.push({ day });
		return { list, byDay };
	});

	function dotClass(d: Deadline): string {
		if (d.isSlaBreached) return 'bg-red-600 ring-2 ring-red-600/30';
		return DOT_CLASS[d.priority] ?? 'bg-slate-400';
	}

	async function load() {
		loading = true;
		try {
			const response = await fetch(`/tickets/sla-calendar?year=${year}&month=${month + 1}`);
			if (response.ok) {
				const data = await response.json();
				deadlines = data.deadlines;
				overdue = data.overdue;
			}
		} catch {
			deadlines = [];
			overdue = [];
		} finally {
			loading = false;
		}
	}

	function shiftMonth(delta: number) {
		const date = new Date(year, month + delta, 1);
		year = date.getFullYear();
		month = date.getMonth();
	}

	function resetToToday() {
		year = today.getFullYear();
		month = today.getMonth();
	}

	$effect(() => {
		void load();
	});
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<div>
				<Card.Title class="leading-none">SLA Calendar</Card.Title>
				<Card.Description>Resolve deadlines this month · click a ticket to open it</Card.Description
				>
			</div>
			<div class="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					onclick={() => shiftMonth(-1)}
					aria-label="Previous month"
				>
					<CaretLeftIcon class="size-4" />
				</Button>
				<Button variant="ghost" size="sm" onclick={resetToToday}>{monthLabel}</Button>
				<Button variant="ghost" size="icon" onclick={() => shiftMonth(1)} aria-label="Next month">
					<CaretRightIcon class="size-4" />
				</Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content class="space-y-4">
		{#if overdue.length > 0}
			<div
				class="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-900/40 dark:bg-red-950/20"
			>
				<p class="mb-2 text-xs font-medium text-red-700 dark:text-red-400">
					Overdue · {overdue.length} open ticket{overdue.length === 1 ? '' : 's'} past due
				</p>
				<div class="flex flex-wrap gap-1.5">
					{#each overdue as ticket (ticket.id)}
						<button
							type="button"
							title={ticket.title}
							onclick={() => void goto(resolve('/(authenticated)/tickets/[id]', { id: ticket.id }))}
							class="rounded-md border border-red-200 bg-background px-2 py-1 font-mono text-xs font-medium hover:bg-muted dark:border-red-900"
						>
							{ticket.ticketCode}
						</button>
					{/each}
				</div>
			</div>
		{/if}
		<div class="grid grid-cols-7 gap-1 text-center">
			{#each WEEKDAYS as day (day)}
				<span class="py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
					{day}
				</span>
			{/each}
			{#each cells.list as cell, i (i)}
				{#if cell === null}
					<span></span>
				{:else}
					{@const items = cells.byDay.get(cell.day) ?? []}
					<div
						class="flex min-h-12 flex-col items-center gap-1 rounded-md p-1 {items.length > 0
							? 'bg-muted/60'
							: ''}"
					>
						<span
							class="text-xs tabular-nums {items.length > 0
								? 'font-semibold'
								: 'text-muted-foreground'}"
						>
							{cell.day}
						</span>
						<span class="flex flex-wrap items-center justify-center gap-1">
							{#each items.slice(0, 4) as item (item.id)}
								<button
									type="button"
									title={`${item.ticketCode} — ${item.title}`}
									aria-label={`Open ${item.ticketCode}`}
									onclick={() =>
										void goto(resolve('/(authenticated)/tickets/[id]', { id: item.id }))}
									class="size-2.5 rounded-full {dotClass(item)}"
								></button>
							{/each}
							{#if items.length > 4}
								<span class="text-[10px] text-muted-foreground">+{items.length - 4}</span>
							{/if}
						</span>
					</div>
				{/if}
			{/each}
		</div>
		{#if loading}
			<p class="text-center text-xs text-muted-foreground">Loading deadlines...</p>
		{/if}
		<div class="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
			<span class="flex items-center gap-1"
				><span class="size-2 rounded-full bg-red-500"></span>Critical</span
			>
			<span class="flex items-center gap-1"
				><span class="size-2 rounded-full bg-orange-500"></span>High</span
			>
			<span class="flex items-center gap-1"
				><span class="size-2 rounded-full bg-yellow-500"></span>Medium</span
			>
			<span class="flex items-center gap-1"
				><span class="size-2 rounded-full bg-slate-400"></span>Low</span
			>
			<span class="flex items-center gap-1"
				><span class="size-2 rounded-full bg-red-600 ring-2 ring-red-600/30"></span>Breached</span
			>
		</div>
	</Card.Content>
</Card.Root>
