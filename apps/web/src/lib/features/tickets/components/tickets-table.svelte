<script lang="ts">
	import { CloudArrowDownIcon, XIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ColumnDef } from '@tanstack/table-core';
	import { DataTable, DataTableViewOptions } from '$lib/components/shared/data-table/index.js';
	import Columns from './columns.svelte';
	import type { TicketWithRelations } from '$lib/features/tickets/types';
	import { goto } from '$app/navigation';
	import { page as pageState } from '$app/state';
	import { resolve } from '$app/paths';
	import * as Select from '$lib/components/ui/select/index.js';

	let {
		tickets = [],
		totalCount = 0,
		page = 1,
		limit = 10
	}: {
		tickets?: TicketWithRelations[];
		totalCount?: number;
		page?: number;
		limit?: number;
	} = $props();

	let columns: ColumnDef<TicketWithRelations, unknown>[] = $state([]);

	let pageIndex = $state(0);
	let pageSize = $state(10);
	const pageCount = $derived(Math.ceil(totalCount / pageSize));

	const url = $derived(pageState.url);

	const activeStatus = $derived(url.searchParams.get('status') || '');
	const activePriority = $derived(url.searchParams.get('priority') || '');
	const activeSla = $derived(url.searchParams.get('sla_breached') || '');

	const hasActiveFilters = $derived(!!(activeStatus || activePriority || activeSla));

	let filterStatus = $state('');
	let filterPriority = $state('');
	let filterSla = $state('');

	$effect.pre(() => {
		filterStatus = activeStatus;
		filterPriority = activePriority;
		filterSla = activeSla;

		pageIndex = page - 1;
		pageSize = limit;
	});

	function navigate(search: string) {
		goto(resolve('/(authenticated)/tickets') + search, {
			keepFocus: true,
			noScroll: true
		});
	}

	function applyFilter(key: string, value: string) {
		const nextUrl = new URL(pageState.url);
		if (value) {
			nextUrl.searchParams.set(key, value);
		} else {
			nextUrl.searchParams.delete(key);
		}
		nextUrl.searchParams.delete('page');
		navigate(nextUrl.search);
	}

	function resetFilters() {
		const nextUrl = new URL(pageState.url);
		nextUrl.searchParams.delete('status');
		nextUrl.searchParams.delete('priority');
		nextUrl.searchParams.delete('sla_breached');
		nextUrl.searchParams.delete('page');
		navigate(nextUrl.search);
	}

	$effect(() => {
		if (filterStatus !== activeStatus) applyFilter('status', filterStatus);
	});

	$effect(() => {
		if (filterPriority !== activePriority) applyFilter('priority', filterPriority);
	});

	$effect(() => {
		if (filterSla !== activeSla) applyFilter('sla_breached', filterSla);
	});

	$effect(() => {
		const currentUrl = pageState.url;
		const urlPage = parseInt(currentUrl.searchParams.get('page') || '1');
		const urlLimit = parseInt(currentUrl.searchParams.get('limit') || '10');

		if (pageIndex + 1 !== urlPage || pageSize !== urlLimit) {
			const nextUrl = new URL(currentUrl);
			nextUrl.searchParams.set('page', String(pageIndex + 1));
			nextUrl.searchParams.set('limit', String(pageSize));
			navigate(nextUrl.search);
		}
	});

	const statusLabels: Record<string, string> = {
		open: 'Status: Open',
		in_progress: 'Status: In Progress',
		resolved: 'Status: Resolved',
		closed: 'Status: Closed'
	};

	const priorityLabels: Record<string, string> = {
		CRITICAL: 'Priority: Critical',
		HIGH: 'Priority: High',
		MEDIUM: 'Priority: Medium',
		LOW: 'Priority: Low'
	};

	const slaLabels: Record<string, string> = {
		true: 'SLA: Breached',
		false: 'SLA: Safe'
	};

	const statusLabel = $derived(
		filterStatus ? (statusLabels[filterStatus] ?? filterStatus) : 'Status'
	);
	const priorityLabel = $derived(
		filterPriority ? (priorityLabels[filterPriority] ?? filterPriority) : 'Priority'
	);
	const slaLabel = $derived(filterSla ? (slaLabels[filterSla] ?? filterSla) : 'SLA');

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];

	const priorityOptions = [
		{ label: 'Critical', value: 'CRITICAL' },
		{ label: 'High', value: 'HIGH' },
		{ label: 'Medium', value: 'MEDIUM' },
		{ label: 'Low', value: 'LOW' }
	];

	const slaOptions = [
		{ label: 'Breached', value: 'true' },
		{ label: 'Safe', value: 'false' }
	];
</script>

<Columns bind:columns />

<DataTable
	data={tickets}
	{columns}
	bind:pageIndex
	bind:pageSize
	{pageCount}
	manualPagination={true}
>
	{#snippet toolbar(table)}
		<div class="flex items-center justify-between">
			<div class="flex flex-1 items-center space-x-2">
				<Select.Root type="single" bind:value={filterStatus}>
					<Select.Trigger class="max-w-fit min-w-32">
						{statusLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Status</Select.Item>
						{#each statusOptions as opt (opt.value)}
							<Select.Item value={opt.value}>{opt.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<Select.Root type="single" bind:value={filterPriority}>
					<Select.Trigger class="max-w-fit min-w-32">
						{priorityLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Priority</Select.Item>
						{#each priorityOptions as opt (opt.value)}
							<Select.Item value={opt.value}>{opt.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				<Select.Root type="single" bind:value={filterSla}>
					<Select.Trigger class="max-w-fit min-w-32">
						{slaLabel}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All SLA</Select.Item>
						{#each slaOptions as opt (opt.value)}
							<Select.Item value={opt.value}>{opt.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				{#if hasActiveFilters}
					<Button variant="ghost" onclick={resetFilters} class="px-2 lg:px-3">
						Reset
						<XIcon class="ms-2 size-4" />
					</Button>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					class="h-8"
					href={resolve('/tickets/export') + pageState.url.search}
					download="tickets-export.csv"
				>
					<CloudArrowDownIcon />
					Export
				</Button>
				<DataTableViewOptions {table} />
			</div>
		</div>
	{/snippet}
</DataTable>
