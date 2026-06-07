import { fail, error } from '@sveltejs/kit';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import type { PageServerLoad, Actions } from './$types';
import {
	getUserById,
	getCategories,
	getCategoryDistribution,
	updateProfile,
	getPasswordAccount,
	updateAccountPassword
} from '@trak/services';
import { requireAuth, getFormString } from '$lib/server/helpers';
import {
	createCategoryAction,
	updateCategoryAction,
	deleteCategoryAction,
	toggleCategoryAction
} from '$lib/features/category/category.actions.server';

export const load: PageServerLoad = async (event) => {
	const session = requireAuth(event);

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
		const session = requireAuth(event);
		const formData = await event.request.formData();
		const name = getFormString(formData, 'name');

		if (!name.trim()) {
			return fail(400, { profileError: 'Name is required' });
		}

		await updateProfile(session.id, name);

		return { profileSuccess: true };
	},

	changePassword: async (event) => {
		const session = requireAuth(event);
		const formData = await event.request.formData();
		const currentPassword = getFormString(formData, 'currentPassword');
		const newPassword = getFormString(formData, 'newPassword');
		const confirmPassword = getFormString(formData, 'confirmPassword');

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

	'category/create': createCategoryAction,
	'category/update': updateCategoryAction,
	'category/toggle': toggleCategoryAction,
	'category/delete': deleteCategoryAction
};
