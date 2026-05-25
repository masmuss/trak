import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategoryById,
	updateCategory
} from '@trak/services';

export const load: PageServerLoad = async () => {
	const allCategories = await getCategories();

	return {
		categories: allCategories
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'Category name is required' });
		}

		await createCategory({
			name: name.trim(),
			description: description?.trim() || null
		});

		return { success: true };
	},

	update: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const isActive = formData.get('isActive') as string;

		if (!id) {
			return fail(400, { error: 'Category ID is required' });
		}

		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'Category name is required' });
		}

		const existing = await getCategoryById(id);

		if (!existing) {
			throw error(404, 'Category not found');
		}

		await updateCategory(id, {
			name: name.trim(),
			description: description?.trim() || null,
			isActive: isActive === 'true'
		});

		return { success: true };
	},

	delete: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Category ID is required' });
		}

		const existing = await getCategoryById(id);

		if (!existing) {
			throw error(404, 'Category not found');
		}

		await deleteCategory(id);

		return { success: true };
	}
};
