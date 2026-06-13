<script lang="ts" generics="TData">
	import { SlidersHorizontalIcon } from 'phosphor-svelte';
	import type { Table, Column } from '@tanstack/table-core';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { table }: { table: Table<TData> } = $props();

	// Get column label from header definition or fallback to column id
	function getColumnLabel(column: Column<TData, unknown>): string {
		// Try to get label from header definition
		const header = column.columnDef.header;
		if (typeof header === 'string') {
			return header;
		}
		// Try to get from meta (using type assertion for custom meta properties)
		const meta = column.columnDef.meta as { label?: string } | undefined;
		if (meta?.label && typeof meta.label === 'string') {
			return meta.label;
		}
		// Fallback to column id with formatting
		return column.id
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (str: string) => str.toUpperCase())
			.trim();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'outline',
			size: 'sm',
			class: 'ms-auto hidden h-8 lg:flex'
		})}
	>
		<SlidersHorizontalIcon />
		View
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each table
				.getAllColumns()
				.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column)}
				{@const label = getColumnLabel(column)}
				<DropdownMenu.CheckboxItem
					bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
					class="gap-3"
				>
					<span class="whitespace-nowrap">{label}</span>
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
