<script lang="ts">
	import * as Table from '$lib/components/ui/table';
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
						<form
							method="POST"
							action={actionPrefix + '/delete'}
							use:enhance={deleteEnhance}
							onsubmit={(e) => {
								if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
									e.preventDefault();
								}
							}}
						>
							<input type="hidden" name="id" value={category.id} />
							<Button variant="ghost" size="icon-sm" type="submit">
								<TrashIcon />
								<span class="sr-only">Delete</span>
							</Button>
						</form>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
