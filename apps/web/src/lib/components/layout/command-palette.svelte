<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Command from '$lib/components/ui/command/index.js';
	import { visibleNavGroups, type NavHref } from '$lib/config/navigation';
	import TicketIcon from 'phosphor-svelte/lib/Ticket';
	import { onMount } from 'svelte';

	interface TicketHit {
		id: string;
		ticketCode: string;
		title: string;
		status: string;
		priority: string;
	}

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let query = $state('');
	let hits = $state<TicketHit[]>([]);
	let loading = $state(false);
	let debounce: ReturnType<typeof setTimeout> | undefined;

	const role = $derived(page.data.user?.role);
	const navItems = $derived(
		visibleNavGroups(role).flatMap((group) =>
			group.items.flatMap((item) => [
				{ title: item.title, url: item.url, group: group.label },
				...(item.items ?? []).map((sub) => ({
					title: `${item.title} — ${sub.title}`,
					url: sub.url,
					group: group.label
				}))
			])
		)
	);

	function close() {
		open = false;
		query = '';
		hits = [];
	}

	function go(url: NavHref) {
		close();
		void goto(resolve(url));
	}

	function goTicket(id: string) {
		close();
		void goto(resolve('/(authenticated)/tickets/[id]', { id }));
	}

	async function searchTickets(value: string) {
		const trimmed = value.trim();
		if (trimmed.length < 2) {
			hits = [];
			loading = false;
			return;
		}
		loading = true;
		try {
			const response = await fetch(`/tickets/search?q=${encodeURIComponent(trimmed)}`);
			hits = response.ok ? await response.json() : [];
		} catch {
			hits = [];
		} finally {
			loading = false;
		}
	}

	function onQueryChange(value: string) {
		clearTimeout(debounce);
		debounce = setTimeout(() => void searchTickets(value), 200);
	}

	$effect(() => {
		onQueryChange(query);
	});

	onMount(() => {
		const onKeydown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				open = !open;
			}
		};
		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});
</script>

<Command.Dialog bind:open bind:value={query}>
	<Command.Input placeholder="Search tickets or navigate..." />
	<Command.List>
		<Command.Empty>{loading ? 'Searching...' : 'No results found.'}</Command.Empty>
		{#if hits.length > 0}
			<Command.Group heading="Tickets">
				{#each hits as hit (hit.id)}
					<Command.Item value={`${hit.ticketCode} ${hit.title}`} onSelect={() => goTicket(hit.id)}>
						<TicketIcon class="size-4 shrink-0 text-muted-foreground" />
						<span class="font-mono text-xs font-medium">{hit.ticketCode}</span>
						<span class="min-w-0 flex-1 truncate text-sm">{hit.title}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
		<Command.Group heading="Navigation">
			{#each navItems as item (item.url + item.title)}
				<Command.Item
					value={`${item.group} ${item.title}`}
					onSelect={() => go(item.url)}
					class="flex w-full items-center gap-2 [&>svg]:hidden"
				>
					<span class="min-w-0 flex-1 truncate text-sm">{item.title}</span>
					<span class="ml-auto shrink-0 text-xs text-muted-foreground">{item.group}</span>
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
