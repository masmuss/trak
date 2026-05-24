import { fail, error } from '@sveltejs/kit';
import { db, categories } from '@trak/database';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allCategories = await db.query.categories.findMany({
		orderBy: (categories, { desc }) => [desc(categories.createdAt)]
	});

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

		await db.insert(categories).values({
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

		const existing = await db.query.categories.findFirst({
			where: eq(categories.id, id)
		});

		if (!existing) {
			throw error(404, 'Category not found');
		}

		await db
			.update(categories)
			.set({
				name: name.trim(),
				description: description?.trim() || null,
				isActive: isActive === 'true'
			})
			.where(eq(categories.id, id));

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

		const existing = await db.query.categories.findFirst({
			where: eq(categories.id, id)
		});

		if (!existing) {
			throw error(404, 'Category not found');
		}

		await db.delete(categories).where(eq(categories.id, id));

		return { success: true };
	}
};
