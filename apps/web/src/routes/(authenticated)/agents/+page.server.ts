import { fail, error } from '@sveltejs/kit';
import { db, user, account } from '@trak/database';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import type { PageServerLoad, Actions } from './$types';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generatePassword(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => CHARS[byte % CHARS.length]).join('');
}

export const load: PageServerLoad = async () => {
	const allUsers = await db.query.user.findMany({
		orderBy: (user, { desc }) => [desc(user.createdAt)]
	});

	return {
		agents: allUsers
	};
};

export const actions: Actions = {
	create: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = (formData.get('role') as string) || 'agent';

		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'Name is required' });
		}

		if (!email || email.trim().length === 0) {
			return fail(400, { error: 'Email is required' });
		}

		const existingEmail = await db.query.user.findFirst({
			where: eq(user.email, email.trim())
		});

		if (existingEmail) {
			return fail(400, { error: 'Email already in use' });
		}

		const password = generatePassword(12);
		const id = crypto.randomUUID();

		await db.insert(user).values({
			id,
			name: name.trim(),
			email: email.trim(),
			emailVerified: true,
			role,
			isActive: true
		});

		await db.insert(account).values({
			id: crypto.randomUUID(),
			userId: id,
			accountId: id,
			providerId: 'credential',
			password: await hashPassword(password)
		});

		return { success: true, password };
	},

	update: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = (formData.get('role') as string) || 'agent';
		const isActive = formData.get('isActive') as string;

		if (!id) {
			return fail(400, { error: 'Agent ID is required' });
		}

		if (!name || name.trim().length === 0) {
			return fail(400, { error: 'Name is required' });
		}

		if (!email || email.trim().length === 0) {
			return fail(400, { error: 'Email is required' });
		}

		const existing = await db.query.user.findFirst({
			where: eq(user.id, id)
		});

		if (!existing) {
			throw error(404, 'Agent not found');
		}

		const emailConflict = await db.query.user.findFirst({
			where: (user, { and, ne }) => and(ne(user.id, id), eq(user.email, email.trim()))
		});

		if (emailConflict) {
			return fail(400, { error: 'Email already in use by another agent' });
		}

		await db
			.update(user)
			.set({
				name: name.trim(),
				email: email.trim(),
				role,
				isActive: isActive === 'true'
			})
			.where(eq(user.id, id));

		return { success: true };
	},

	delete: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Agent ID is required' });
		}

		if (id === currentUser.id) {
			return fail(400, { error: 'Cannot delete your own account' });
		}

		const existing = await db.query.user.findFirst({
			where: eq(user.id, id)
		});

		if (!existing) {
			throw error(404, 'Agent not found');
		}

		await db.delete(user).where(eq(user.id, id));

		return { success: true };
	}
};
