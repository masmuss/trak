<script lang="ts" module>
	import {
		ChartPieIcon,
		TicketIcon,
		UsersIcon,
		KeyIcon,
		TagIcon,
		ShieldIcon,
		GearSixIcon
	} from 'phosphor-svelte';

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: ChartPieIcon
			},
			{
				title: 'Tickets',
				url: '/tickets',
				icon: TicketIcon,
				items: [
					{
						title: 'All Tickets',
						url: '/tickets'
					},
					{
						title: 'Open',
						url: '/tickets?status=open'
					},
					{
						title: 'In Progress',
						url: '/tickets?status=in_progress'
					},
					{
						title: 'Resolved',
						url: '/tickets?status=resolved'
					}
				]
			},
			{
				title: 'Reporters',
				url: '/reporters',
				icon: UsersIcon
			},
			{
				title: 'Invite Codes',
				url: '/invite-codes',
				icon: KeyIcon
			},
			{
				title: 'Categories',
				url: '/categories',
				icon: TagIcon
			},
			{
				title: 'Agents',
				url: '/agents',
				icon: ShieldIcon
			},
			{
				title: 'Settings',
				url: '/settings',
				icon: GearSixIcon
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const user = $derived(page.data.user);
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<div class="flex items-center gap-2 px-2 py-1.5 text-start">
			<div
				class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
			>
				<TicketIcon class="size-4" />
			</div>
			<div
				class="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden"
			>
				<span class="truncate font-semibold">Acme Inc.</span>
				<span class="truncate text-xs text-muted-foreground">Ticketing System</span>
			</div>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if user}
			<NavUser {user} />
		{/if}
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
