<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Category } from '$lib/features/category/types';
	import { PencilIcon, TrashIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import DeleteConfirmDialog from '$lib/components/shared/delete-confirm-dialog.svelte';

	let {
		categories,
		onEdit,
		actionPrefix = '?'
	}: {
		categories: Category[];
		onEdit: (category: Category) => void;
		actionPrefix?: string;
	} = $props();

	let dialogOpen = $state(false);
	let deleteTarget = $state<{ id: string; name: string; action: string } | null>(null);
</script>

<Table.Root class="border">
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Description</Table.Head>
			<Table.Head>Active</Table.Head>
			<Table.Head class="w-25">Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each categories as category (category.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{category.name}</Table.Cell>
				<Table.Cell class="text-muted-foreground">
					{category.description ?? '—'}
				</Table.Cell>
				<Table.Cell>
					{category.isActive ? 'Yes' : 'No'}
				</Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-1">
						<Button variant="ghost" size="icon-sm" onclick={() => onEdit(category)}>
							<PencilIcon />
							<span class="sr-only">Edit</span>
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onclick={() => {
								deleteTarget = {
									id: category.id,
									name: category.name,
									action: actionPrefix + '/delete'
								};
								dialogOpen = true;
							}}
						>
							<TrashIcon />
							<span class="sr-only">Delete</span>
						</Button>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<DeleteConfirmDialog
	bind:open={dialogOpen}
	title={`Delete "${deleteTarget?.name}"?`}
	description="This action cannot be undone. The category will be permanently deleted."
	action={deleteTarget?.action ?? ''}
	id={deleteTarget?.id ?? ''}
	successMessage="Category deleted successfully"
/>
