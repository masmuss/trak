<script lang="ts">
	import { CloudArrowDownIcon, XIcon, MagnifyingGlassIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ColumnDef } from '@tanstack/table-core';
	import {
		DataTable,
		DataTableViewOptions,
		DataTableFacetedFilter
	} from '$lib/components/shared/data-table/index.js';
	import Columns from './columns.svelte';
	import type { TicketWithRelations, Category } from '$lib/features/tickets/types';
	import { goto } from '$app/navigation';
	import { page as pageState } from '$app/state';
	import { resolve } from '$app/paths';

	let {
		tickets = [],
		totalCount = 0,
		page = 1,
		limit = 10,
		categories = []
	}: {
		tickets?: TicketWithRelations[];
		totalCount?: number;
		page?: number;
		limit?: number;
		categories?: Category[];
	} = $props();

	let columns: ColumnDef<TicketWithRelations, unknown>[] = $state([]);

	let pageIndex = $state(0);
	let pageSize = $state(10);
	const pageCount = $derived(Math.ceil(totalCount / pageSize));

	function navigate(search: string) {
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(resolve('/(authenticated)/tickets') + search, {
			keepFocus: true,
			noScroll: true
		});
	}

	$effect.pre(() => {
		pageIndex = page - 1;
		pageSize = limit;
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

	const categoryOptions = $derived(categories.map((c) => ({ label: c.name, value: c.id })));

	let searchValue = $state(pageState.url.searchParams.get('search') || '');

	function applySearch() {
		const nextUrl = new URL(pageState.url);
		if (searchValue.trim()) {
			nextUrl.searchParams.set('search', searchValue.trim());
		} else {
			nextUrl.searchParams.delete('search');
		}
		nextUrl.searchParams.delete('page');
		navigate(nextUrl.search);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			applySearch();
		}
	}

	function toggleFilter(key: string, value: string) {
		const current = pageState.url.searchParams.get(key)?.split(',').filter(Boolean) ?? [];
		const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
		const nextUrl = new URL(pageState.url);
		if (next.length > 0) {
			nextUrl.searchParams.set(key, next.join(','));
		} else {
			nextUrl.searchParams.delete(key);
		}
		nextUrl.searchParams.delete('page');
		navigate(nextUrl.search);
	}

	function clearFilter(key: string) {
		const nextUrl = new URL(pageState.url);
		nextUrl.searchParams.delete(key);
		nextUrl.searchParams.delete('page');
		navigate(nextUrl.search);
	}

	function resetFilters() {
		const nextUrl = new URL(pageState.url);
		for (const key of ['status', 'priority', 'sla_breached', 'categoryId', 'search', 'page']) {
			nextUrl.searchParams.delete(key);
		}
		navigate(nextUrl.search);
	}

	const filterStatus = $derived(
		new Set(pageState.url.searchParams.get('status')?.split(',').filter(Boolean) ?? [])
	);
	const filterPriority = $derived(
		new Set(pageState.url.searchParams.get('priority')?.split(',').filter(Boolean) ?? [])
	);
	const filterSla = $derived(
		new Set(pageState.url.searchParams.get('sla_breached')?.split(',').filter(Boolean) ?? [])
	);
	const filterCategory = $derived(
		new Set(pageState.url.searchParams.get('categoryId')?.split(',').filter(Boolean) ?? [])
	);

	const hasActiveFilters = $derived(
		pageState.url.searchParams.has('status') ||
			pageState.url.searchParams.has('priority') ||
			pageState.url.searchParams.has('sla_breached') ||
			pageState.url.searchParams.has('categoryId') ||
			pageState.url.searchParams.has('search')
	);
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
		<div class="space-y-4">
			<div class="flex flex-wrap items-center gap-4">
				<div class="relative w-full max-w-sm shrink-0">
					<MagnifyingGlassIcon
						class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						bind:value={searchValue}
						placeholder="Search tickets..."
						onkeydown={onKeyDown}
						class="h-8 pl-9"
					/>
				</div>
				<div class="flex flex-wrap items-center gap-2">
					<DataTableFacetedFilter
						title="Status"
						options={statusOptions}
						selectedValues={filterStatus}
						onSelect={(v) => toggleFilter('status', v)}
						onclear={() => clearFilter('status')}
					/>
					<DataTableFacetedFilter
						title="Priority"
						options={priorityOptions}
						selectedValues={filterPriority}
						onSelect={(v) => toggleFilter('priority', v)}
						onclear={() => clearFilter('priority')}
					/>
					<DataTableFacetedFilter
						title="SLA"
						options={slaOptions}
						selectedValues={filterSla}
						onSelect={(v) => toggleFilter('sla_breached', v)}
						onclear={() => clearFilter('sla_breached')}
					/>
					<DataTableFacetedFilter
						title="Category"
						options={categoryOptions}
						selectedValues={filterCategory}
						onSelect={(v) => toggleFilter('categoryId', v)}
						onclear={() => clearFilter('categoryId')}
					/>
					{#if hasActiveFilters}
						<Button variant="ghost" onclick={resetFilters} class="px-2 lg:px-3">
							Reset
							<XIcon class="ms-2 size-4" />
						</Button>
					{/if}
				</div>
			</div>
			<div class="flex items-center justify-end gap-2">
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
