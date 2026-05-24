<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import { TicketIcon } from 'phosphor-svelte';
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<div
				class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
			>
				<TicketIcon class="size-4" />
			</div>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium"> Acme Inc. </span>
				<span class="truncate text-xs">Ticketing System</span>
			</div>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
