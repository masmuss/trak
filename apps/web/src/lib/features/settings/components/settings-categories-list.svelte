<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
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

	const deleteEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success('Category deleted');
				await update();
			} else if (result.type === 'failure') {
				toast.error((result.data?.error as string) ?? 'Failed to delete');
			}
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
					<form
						method="POST"
						action={actionPrefix + '/delete'}
						use:enhance={deleteEnhance}
						onsubmit={(e) => {
							if (!confirm(`Delete "${category.name}"?`)) {
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
			</div>
		</div>
	{/each}
</div>
