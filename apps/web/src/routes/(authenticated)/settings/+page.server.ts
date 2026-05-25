import { fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, user, account } from '@trak/database';
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

	return {
		user: {
			id: currentUser.id,
			name: currentUser.name,
			email: currentUser.email,
			role: currentUser.role,
			createdAt: currentUser.createdAt
		}
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
	}
};
