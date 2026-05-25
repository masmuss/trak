import { fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, user, account, categories } from '@trak/database';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.user;
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(user.id, session.id)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	const [allCategories, allReports] = await Promise.all([
		db.query.categories.findMany({
			orderBy: (categories, { desc }) => [desc(categories.createdAt)]
		}),
		db.query.reports.findMany({
			columns: { categoryId: true }
		})
	]);

	const countMap = new Map<string, number>();
	let uncategorized = 0;
	for (const r of allReports) {
		if (r.categoryId) {
			countMap.set(r.categoryId, (countMap.get(r.categoryId) ?? 0) + 1);
		} else {
			uncategorized++;
		}
	}

	const totalReports = allReports.length;
	const distribution = allCategories.map((cat) => {
		const count = countMap.get(cat.id) ?? 0;
		return {
			categoryId: cat.id,
			categoryName: cat.name,
			count,
			percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0
		};
	});

	return {
		user: {
			id: currentUser.id,
			name: currentUser.name,
			email: currentUser.email,
			role: currentUser.role,
			createdAt: currentUser.createdAt
		},
		categories: allCategories,
		distribution,
		uncategorized
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

		await db.update(user).set({ name: name.trim() }).where(eq(user.id, session.id));

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

		const userAccount = await db.query.account.findFirst({
			where: eq(account.userId, session.id)
		});

		if (!userAccount?.password) {
			return fail(400, { passwordError: 'No password account found' });
		}

		const valid = await verifyPassword({ hash: userAccount.password, password: currentPassword });
		if (!valid) {
			return fail(400, { passwordError: 'Current password is incorrect' });
		}

		const hashed = await hashPassword(newPassword);

		await db.update(account).set({ password: hashed }).where(eq(account.userId, session.id));

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

		await db.insert(categories).values({
			name: name.trim(),
			description: description?.trim() || null
		});

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
