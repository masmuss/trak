<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Category } from '@trak/shared';
	import { handleFormError } from '$lib/utils/form';

	let {
		dialogOpen = $bindable(false),
		editingCategory = $bindable<Category | null>(null),
		onClose,
		actionPrefix = '?'
	}: {
		dialogOpen: boolean;
		editingCategory: Category | null;
		onClose: () => void;
		actionPrefix?: string;
	} = $props();

	const formEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;

			if (result.type === 'success') {
				const label = editingCategory ? 'updated' : 'created';
				toast.success(`Category ${label} successfully`);
				await update();
				onClose();
			}
		};
	};
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<form
			method="POST"
			action={editingCategory ? actionPrefix + '/update' : actionPrefix + '/create'}
			use:enhance={formEnhance}
		>
			<Dialog.Header>
				<Dialog.Title>
					{editingCategory ? 'Edit Category' : 'Add Category'}
				</Dialog.Title>
				<Dialog.Description>
					{editingCategory
						? 'Update the category details below.'
						: 'Create a new category for organizing tickets.'}
				</Dialog.Description>
			</Dialog.Header>

			<Field.Set>
				<Field.Group>
					{#if editingCategory}
						<input type="hidden" name="id" value={editingCategory.id} />
					{/if}

					<Field.Field>
						<Field.Label for="name">Name</Field.Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="e.g. Bug Report"
							required
							value={editingCategory?.name ?? ''}
						/>
						<Field.Description>The display name for this category.</Field.Description>
					</Field.Field>

					<Field.Field>
						<Field.Label for="description">Description</Field.Label>
						<Input
							id="description"
							name="description"
							type="text"
							placeholder="Optional description"
							value={editingCategory?.description ?? ''}
						/>
						<Field.Description>A brief explanation of the category.</Field.Description>
					</Field.Field>

					{#if editingCategory}
						<Field.Field>
							<div class="flex items-center gap-2">
								<input
									id="isActive"
									name="isActive"
									type="checkbox"
									value="true"
									checked={editingCategory.isActive}
								/>
								<Field.Label for="isActive">Active</Field.Label>
							</div>
							<Field.Description>Disable to hide this category from selection.</Field.Description>
						</Field.Field>
					{/if}

					<Field.Field>
						<Button type="submit" class="w-full">
							{editingCategory ? 'Save Changes' : 'Create Category'}
						</Button>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</form>
	</Dialog.Content>
</Dialog.Root>
