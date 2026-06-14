<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import CategoriesTable from '$lib/features/category/components/categories-table.svelte';
	import CategoryForm from '$lib/features/category/components/category-form.svelte';
	import { useCategoryDialog } from '$lib/features/category/use-category-dialog.svelte';

	let { data }: { data: PageData } = $props();

	const dialog = useCategoryDialog();
</script>

<svelte:head>
	<title>Categories</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading
			title="Categories"
			description="Manage ticket categories for organizing and classifying reports."
		/>
		<Button onclick={dialog.openCreate}>
			<PlusIcon />
			Add Category
		</Button>
	</div>

	<CategoriesTable categories={data.categories} onEdit={dialog.openEdit} />
</div>

<CategoryForm
	bind:dialogOpen={dialog.dialogOpen}
	bind:editingCategory={dialog.editingCategory}
	onClose={dialog.closeDialog}
/>
