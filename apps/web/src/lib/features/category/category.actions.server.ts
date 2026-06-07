import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { createCategory, deleteCategory, getCategoryById, updateCategory } from '@trak/services';
import { requireAuth, getFormString, getFormBool, requireExists } from '$lib/server/helpers';

export async function createCategoryAction(event: RequestEvent) {
	requireAuth(event);
	const formData = await event.request.formData();
	const name = getFormString(formData, 'name');
	const description = getFormString(formData, 'description');

	if (!name.trim()) {
		return fail(400, { error: 'Category name is required' });
	}

	await createCategory({
		name: name.trim(),
		description: description.trim() || null
	});

	return { success: true };
}

export async function updateCategoryAction(event: RequestEvent) {
	requireAuth(event);
	const formData = await event.request.formData();
	const id = getFormString(formData, 'id');
	const name = getFormString(formData, 'name');
	const description = getFormString(formData, 'description');
	const isActive = getFormBool(formData, 'isActive');

	if (!id) {
		return fail(400, { error: 'Category ID is required' });
	}

	if (!name.trim()) {
		return fail(400, { error: 'Category name is required' });
	}

	const existing = await getCategoryById(id);
	requireExists(existing, 'Category');

	await updateCategory(id, {
		name: name.trim(),
		description: description.trim() || null,
		isActive
	});

	return { success: true };
}

export async function deleteCategoryAction(event: RequestEvent) {
	requireAuth(event);
	const formData = await event.request.formData();
	const id = getFormString(formData, 'id');

	if (!id) {
		return fail(400, { error: 'Category ID is required' });
	}

	const existing = await getCategoryById(id);
	requireExists(existing, 'Category');

	await deleteCategory(id);

	return { success: true };
}

export async function toggleCategoryAction(event: RequestEvent) {
	requireAuth(event);
	const formData = await event.request.formData();
	const id = getFormString(formData, 'id');

	if (!id) {
		return fail(400, { error: 'Category ID is required' });
	}

	const existing = await getCategoryById(id);
	requireExists(existing, 'Category');

	await updateCategory(id, {
		name: existing.name,
		description: existing.description,
		isActive: !existing.isActive
	});

	return { success: true };
}
