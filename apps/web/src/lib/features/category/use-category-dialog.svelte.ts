import type { Category } from '@trak/shared';

export function useCategoryDialog() {
	let editingCategory = $state<Category | null>(null);
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

	return {
		get editingCategory() {
			return editingCategory;
		},
		set editingCategory(v) {
			editingCategory = v;
		},
		get dialogOpen() {
			return dialogOpen;
		},
		set dialogOpen(v) {
			dialogOpen = v;
		},
		openCreate,
		openEdit,
		closeDialog
	};
}
