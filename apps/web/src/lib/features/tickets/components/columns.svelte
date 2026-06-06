<script lang="ts">
	/* eslint-disable no-useless-assignment */
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import getInitials from '$lib/utils/initials';
	import type { ColumnDef, CellContext } from '@tanstack/table-core';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { DataTableColumnHeader } from '$lib/components/shared/data-table/index.js';
	import { DotsThreeVerticalIcon } from 'phosphor-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { TicketWithRelations } from '$lib/features/tickets/types';
	import StatusBadge from './status-badge.svelte';
	import PriorityBadge from './priority-badge.svelte';

	let { columns = $bindable() }: { columns: ColumnDef<TicketWithRelations, unknown>[] } = $props();

	function formatDate(date: Date) {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	$effect(() => {
		columns = [
			{
				accessorKey: 'ticketCode',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Ticket ID' }),
				cell: (context) => renderSnippet(idCell, context),
				meta: { className: 'w-[110px] min-w-[110px]' }
			},
			{
				accessorKey: 'title',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Subject' }),
				cell: (context) => renderSnippet(subjectCell, context),
				meta: { className: 'max-w-[300px] md:max-w-[400px] lg:max-w-[500px] truncate' }
			},
			{
				id: 'reporter',
				accessorFn: (row) => row.reporter.fullName,
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Requested By' }),
				cell: (context) => renderSnippet(reporterCell, context),
				meta: { className: 'w-[150px] min-w-[150px]' }
			},
			{
				accessorKey: 'priority',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Priority' }),
				cell: (context) => renderSnippet(priorityCell, context),
				meta: { className: 'w-[100px] min-w-[100px]' }
			},
			{
				accessorKey: 'status',
				header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Status' }),
				cell: (context) => renderSnippet(statusCell, context),
				meta: { className: 'w-[120px] min-w-[120px]' }
			},
			{
				accessorKey: 'isSlaBreached',
				header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'SLA' }),
				cell: (context) => renderSnippet(slaCell, context),
				meta: { className: 'w-[80px] min-w-[80px]' }
			},
			{
				accessorKey: 'createdAt',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Created' }),
				cell: (context) => renderSnippet(dateCell, context),
				meta: { className: 'w-[130px] min-w-[130px]' }
			},
			{
				id: 'actions',
				cell: (context) => renderSnippet(actionsCell, context),
				meta: { className: 'w-[60px] min-w-[60px]' }
			}
		];
	});
</script>

{#snippet idCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<span class="font-mono text-xs font-medium">
		{row.original.ticketCode}
	</span>
{/snippet}

{#snippet subjectCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<a
		href={resolve(`/(authenticated)/tickets/[id]`, {
			id: row.original.id
		})}
		class="block truncate font-medium hover:text-primary hover:underline"
		title={row.original.title}
	>
		{row.original.title}
	</a>
{/snippet}

{#snippet reporterCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<div class="flex items-center gap-2">
		<div
			class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary"
		>
			{getInitials(row.original.reporter.fullName)}
		</div>
		<span class="text-sm font-medium">{row.original.reporter.fullName}</span>
	</div>
{/snippet}

{#snippet slaCell({ row }: CellContext<TicketWithRelations, unknown>)}
	{@const breached = row.original.isSlaBreached}
	{@const hasSla = !!row.original.slaResolveDue}
	{#if breached}
		<div class="flex items-center gap-1.5">
			<span class="size-2 rounded-full bg-red-500"></span>
			<span class="text-xs text-red-600">Breached</span>
		</div>
	{:else if hasSla}
		<div class="flex items-center gap-1.5">
			<span class="size-2 rounded-full bg-green-500"></span>
			<span class="text-xs text-green-600">On Track</span>
		</div>
	{/if}
{/snippet}

{#snippet priorityCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<PriorityBadge priority={row.original.priority} />
{/snippet}

{#snippet statusCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<StatusBadge status={row.original.status} />
{/snippet}

{#snippet dateCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<span class="text-sm text-muted-foreground">
		{formatDate(new Date(row.original.createdAt))}
	</span>
{/snippet}

{#snippet actionsCell({ row }: CellContext<TicketWithRelations, unknown>)}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<DotsThreeVerticalIcon class="size-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-36 rounded-lg">
			<DropdownMenu.Item
				onSelect={() =>
					goto(
						resolve(`/(authenticated)/tickets/[id]`, {
							id: row.original.id
						})
					)}
			>
				View Details
			</DropdownMenu.Item>
			<DropdownMenu.Item>Assign Agent</DropdownMenu.Item>
			<DropdownMenu.Item class="text-destructive focus:text-destructive">
				Delete Ticket
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
