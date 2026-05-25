<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { PlusIcon } from 'phosphor-svelte';
	import type { Category } from '@trak/shared';
	import SettingsCategoriesList from './settings-categories-list.svelte';
	import SettingsCategoryDistribution from './settings-category-distribution.svelte';
	import CategoryForm from '$lib/features/category/components/category-form.svelte';

	type DistItem = {
		categoryId: string;
		categoryName: string;
		count: number;
		percentage: number;
	};

	let {
		categories,
		distribution = [],
		uncategorized = 0
	}: {
		categories: Category[];
		distribution?: DistItem[];
		uncategorized?: number;
	} = $props();

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

<div class="grid grid-cols-3 gap-4">
	<Card.Root class="col-span-2">
		<Card.Header>
			<Card.Title>Ticket Categories</Card.Title>
			<Card.Description>Define how reports are classified across the system.</Card.Description>
			<Card.Action>
				<Button onclick={openCreate}>
					<PlusIcon />
					Add Category
				</Button>
			</Card.Action>
		</Card.Header>
		<SettingsCategoriesList {categories} onEdit={openEdit} actionPrefix="?/category" />
	</Card.Root>
	<SettingsCategoryDistribution {distribution} {uncategorized} />
</div>

<CategoryForm
	bind:dialogOpen
	bind:editingCategory
	onClose={closeDialog}
	actionPrefix="?/category"
/>
