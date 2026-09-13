<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@trak/shared';

	let {
		filters
	}: {
		filters: {
			action: string;
			entityType: string;
			search: string;
			from: string;
			to: string;
		};
	} = $props();

	let selectedAction = $state<string | undefined>(undefined);
	let selectedEntityType = $state<string | undefined>(undefined);

	$effect(() => {
		selectedAction = filters.action || undefined;
		selectedEntityType = filters.entityType || undefined;
	});

	function exportHref(): string {
		const params = new SvelteURLSearchParams();
		if (selectedAction) params.set('action', selectedAction);
		if (selectedEntityType) params.set('entityType', selectedEntityType);
		if (filters.search) params.set('search', filters.search);
		if (filters.from) params.set('from', filters.from);
		if (filters.to) params.set('to', filters.to);
		return `audit-logs/export?${params.toString()}`;
	}
</script>

<Card.Root>
	<Card.Content class="pt-6">
		<form method="GET" class="grid gap-3 md:grid-cols-3">
			<input type="hidden" name="action" value={selectedAction ?? ''} />
			<input type="hidden" name="entityType" value={selectedEntityType ?? ''} />
			<div class="grid gap-1.5">
				<Label>Action</Label>
				<Select.Root type="single" bind:value={selectedAction}>
					<Select.Trigger>
						{selectedAction
							? (AUDIT_ACTIONS.find((a) => a === selectedAction) ?? selectedAction)
							: 'All actions'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All actions</Select.Item>
						{#each AUDIT_ACTIONS as action (action)}
							<Select.Item value={action}>{action}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-1.5">
				<Label>Entity type</Label>
				<Select.Root type="single" bind:value={selectedEntityType}>
					<Select.Trigger>
						{selectedEntityType ?? 'All entities'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All entities</Select.Item>
						{#each AUDIT_ENTITY_TYPES as entityType (entityType)}
							<Select.Item value={entityType}>{entityType}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-1.5">
				<Label for="search">Search</Label>
				<Input id="search" name="search" placeholder="Action or entity ID" value={filters.search} />
			</div>
			<div class="grid gap-1.5">
				<Label for="from">From</Label>
				<Input id="from" name="from" type="date" value={filters.from} />
			</div>
			<div class="grid gap-1.5">
				<Label for="to">To</Label>
				<Input id="to" name="to" type="date" value={filters.to} />
			</div>
			<div class="flex items-end gap-2">
				<Button type="submit">Filter</Button>
				<Button variant="outline" href={exportHref()}>Export CSV</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
