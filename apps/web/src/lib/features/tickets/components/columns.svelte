<script lang="ts">
	/* eslint-disable no-useless-assignment */
	import { resolve } from '$app/paths';
	import getInitials from '$lib/utils/initials';
	import type { ColumnDef, CellContext } from '@tanstack/table-core';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { DataTableColumnHeader } from '$lib/components/shared/data-table/index.js';
	import type { TicketWithRelations } from '@trak/shared';
	import StatusBadge from './status-badge.svelte';
	import PriorityBadge from './priority-badge.svelte';
	import { Badge } from '$lib/components/ui/badge';

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
				meta: { label: 'Ticket ID' }
			},
			{
				accessorKey: 'title',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Subject' }),
				cell: (context) => renderSnippet(subjectCell, context),
				meta: {
					label: 'Subject'
				}
			},
			{
				id: 'reporter',
				accessorFn: (row) => row.reporter.fullName,
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Requested By' }),
				cell: (context) => renderSnippet(reporterCell, context),
				meta: { label: 'Requested By' }
			},
			{
				accessorKey: 'priority',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Priority' }),
				cell: (context) => renderSnippet(priorityCell, context),
				meta: { label: 'Priority' }
			},
			{
				accessorKey: 'status',
				header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Status' }),
				cell: (context) => renderSnippet(statusCell, context),
				meta: { label: 'Status' }
			},
			{
				accessorKey: 'isSlaBreached',
				header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'SLA' }),
				cell: (context) => renderSnippet(slaCell, context),
				meta: { label: 'SLA Status' }
			},
			{
				accessorKey: 'createdAt',
				header: ({ column }) =>
					renderComponent(DataTableColumnHeader, { column, title: 'Created' }),
				cell: (context) => renderSnippet(dateCell, context),
				meta: { label: 'Created Date' }
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
	<span class="flex flex-row items-center gap-2">
		<Badge variant="outline">{row.original.category?.name}</Badge>
		<a
			href={resolve(`/(authenticated)/tickets/[id]`, {
				id: row.original.id
			})}
			class="truncate font-medium hover:text-primary hover:underline"
			title={row.original.title}
		>
			{row.original.title}
		</a>
	</span>
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
		<span class="inline-block size-2.5 rounded-full bg-red-500" title="SLA Breached"></span>
	{:else if hasSla}
		<span class="inline-block size-2.5 rounded-full bg-green-500" title="SLA On Track"></span>
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
