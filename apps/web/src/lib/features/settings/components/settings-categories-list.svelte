<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { PencilIcon, TrashIcon } from 'phosphor-svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Category } from '@trak/shared';

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
				toast.success('Category deleted');
				await update();
			} else if (result.type === 'failure') {
				toast.error((result.data?.error as string) ?? 'Failed to delete');
			}
			dialogOpen = false;
			deleteTarget = null;
		};
	};
</script>

<div class="divide-y">
	{#each categories as category (category.id)}
		<div
			class="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50 nth-last-[1]:pb-0"
		>
			<div class="flex items-center gap-4">
				<Avatar.Root>
					<Avatar.Fallback>
						{category.name.slice(0, 2)}
					</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<p class="text-sm font-medium">{category.name}</p>
					<p class="text-xs text-muted-foreground">{category.description ?? '—'}</p>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<Badge
					variant={category.isActive ? 'default' : 'secondary'}
					class="text-[10px] tracking-wider uppercase"
				>
					{category.isActive ? 'Active' : 'Inactive'}
				</Badge>
				<div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
			</div>
		</div>
	{/each}
</div>

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
