import { fail, error } from '@sveltejs/kit';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import type { PageServerLoad, Actions } from './$types';
import {
	getUserById,
	getCategories,
	getCategoryDistribution,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	updateProfile,
	getPasswordAccount,
	updateAccountPassword
} from '@trak/services';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.user;
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const [currentUser, categoriesList, distributionData] = await Promise.all([
		getUserById(session.id),
		getCategories(),
		getCategoryDistribution()
	]);

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	return {
		user: {
			id: currentUser.id,
			name: currentUser.name,
			email: currentUser.email,
			role: currentUser.role,
			createdAt: currentUser.createdAt
		},
		categories: categoriesList,
		distribution: distributionData.distribution,
		uncategorized: distributionData.uncategorized
	};
};

export const actions: Actions = {
	updateProfile: async (event) => {
		const session = event.locals.user;
		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const name = formData.get('name') as string;

		if (!name || name.trim().length === 0) {
			return fail(400, { profileError: 'Name is required' });
		}

		await updateProfile(session.id, name);

		return { profileSuccess: true };
	},

	changePassword: async (event) => {
		const session = event.locals.user;
		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const currentPassword = formData.get('currentPassword') as string;
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { passwordError: 'All password fields are required' });
		}

		if (newPassword.length < 8) {
			return fail(400, { passwordError: 'New password must be at least 8 characters' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'New passwords do not match' });
		}

		const userAccount = await getPasswordAccount(session.id);

		if (!userAccount?.password) {
			return fail(400, { passwordError: 'No password account found' });
		}

		const valid = await verifyPassword({ hash: userAccount.password, password: currentPassword });
		if (!valid) {
			return fail(400, { passwordError: 'Current password is incorrect' });
		}

		const hashed = await hashPassword(newPassword);

		await updateAccountPassword(session.id, hashed);

		return { passwordSuccess: true };
	},

	'category/create': async (event) => {
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

		await createCategory({ name, description });

		return { success: true };
	},

	'category/update': async (event) => {
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

	'category/toggle': async (event) => {
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

		await updateCategory(id, {
			name: existing.name,
			description: existing.description,
			isActive: !existing.isActive
		});

		return { success: true };
	},

	'category/delete': async (event) => {
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
