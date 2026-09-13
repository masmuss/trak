import { error, fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import {
	createCategory,
	deleteCategory,
	getCategoryById,
	updateCategory,
	createAuditLog
} from '@trak/services';
import { requireRole, getFormString, getFormBool, requireExists } from '$lib/server/helpers';

async function getCategoryFromForm(event: RequestEvent) {
	const formData = await event.request.formData();
	const id = getFormString(formData, 'id');
	if (!id) throw error(400, 'Category ID is required');
	const existing = await getCategoryById(id);
	requireExists(existing, 'Category');
	return { id, existing };
}

export async function createCategoryAction(event: RequestEvent) {
	const user = requireRole(event, 'admin');
	const formData = await event.request.formData();
	const name = getFormString(formData, 'name');
	const description = getFormString(formData, 'description');

	if (!name.trim()) {
		return fail(400, { error: 'Category name is required' });
	}

	const id = await createCategory({
		name: name.trim(),
		description: description.trim() || null
	});
	await createAuditLog({
		actorUserId: user.id,
		action: 'category.created',
		entityType: 'category',
		entityId: id,
		afterData: { name: name.trim(), description: description.trim() || null, isActive: true }
	});

	return { success: true };
}

export async function updateCategoryAction(event: RequestEvent) {
	const user = requireRole(event, 'admin');
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
	await createAuditLog({
		actorUserId: user.id,
		action: 'category.updated',
		entityType: 'category',
		entityId: id,
		beforeData: existing,
		afterData: { name: name.trim(), description: description.trim() || null, isActive }
	});

	return { success: true };
}

export async function deleteCategoryAction(event: RequestEvent) {
	const user = requireRole(event, 'admin');
	const { id, existing } = await getCategoryFromForm(event);
	await deleteCategory(id);
	await createAuditLog({
		actorUserId: user.id,
		action: 'category.deleted',
		entityType: 'category',
		entityId: id,
		beforeData: existing
	});
	return { success: true };
}

export async function toggleCategoryAction(event: RequestEvent) {
	const user = requireRole(event, 'admin');
	const { existing } = await getCategoryFromForm(event);
	await updateCategory(existing.id, {
		name: existing.name,
		description: existing.description,
		isActive: !existing.isActive
	});
	await createAuditLog({
		actorUserId: user.id,
		action: 'category.updated',
		entityType: 'category',
		entityId: existing.id,
		beforeData: { isActive: existing.isActive },
		afterData: { isActive: !existing.isActive }
	});
	return { success: true };
}
