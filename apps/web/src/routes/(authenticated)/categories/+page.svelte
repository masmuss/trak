<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import type { Category } from '@trak/shared';
	import CategoriesTable from '$lib/features/category/components/categories-table.svelte';
	import CategoryForm from '$lib/features/category/components/category-form.svelte';

	let { data }: { data: PageData } = $props();

	let editingCategory: Category | null = $state(null);
	let dialogOpen = $state(false);

	function openCreate() {
		editingCategory = null;
		dialogOpen = true;
	}

	function openEdit(category: Category) {
		editingCategory = category;
		dialogOpen = true;
	}

	function closeDialog() {
		dialogOpen = false;
		editingCategory = null;
	}
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
		<Button onclick={openCreate}>
			<PlusIcon />
			Add Category
		</Button>
	</div>

	<CategoriesTable categories={data.categories} onEdit={openEdit} />
</div>

<CategoryForm bind:dialogOpen bind:editingCategory onClose={closeDialog} />
