<script lang="ts" module>
	import {
		ChartPieIcon,
		TicketIcon,
		UsersIcon,
		KeyIcon,
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
	import AppLogo from '../shared/app-logo.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const user = $derived(page.data.user);
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<AppLogo />
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
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
