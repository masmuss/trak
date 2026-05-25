<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Category } from '$lib/features/category/types';
	import { PencilIcon, TrashIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

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

	const deleteEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success('Category deleted successfully');
				await update();
			} else if (result.type === 'error') {
				toast.error(result.error?.message ?? 'Something went wrong');
			} else if (result.type === 'failure') {
				toast.error((result.data?.error as string) ?? 'Invalid submission');
			}
			dialogOpen = false;
			deleteTarget = null;
		};
	};
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

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete "{deleteTarget?.name}"?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. The category will be permanently deleted.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action={deleteTarget?.action ?? ''} use:enhance={deleteEnhance}>
			<input type="hidden" name="id" value={deleteTarget?.id} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action type="submit" variant="destructive">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
