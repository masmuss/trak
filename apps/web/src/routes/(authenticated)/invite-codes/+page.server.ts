import { fail, error } from '@sveltejs/kit';
import { db, inviteCodes } from '@trak/database';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const all = await db.query.inviteCodes.findMany({
		orderBy: (inviteCodes, { desc }) => [desc(inviteCodes.createdAt)]
	});

	return {
		inviteCodes: all
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const code = formData.get('code') as string;
		const expiresAtRaw = formData.get('expiresAt') as string | null;

		if (!code || code.trim().length === 0) {
			return fail(400, { error: 'Code is required' });
		}

		const expiresAt = expiresAtRaw && expiresAtRaw.trim() ? new Date(expiresAtRaw) : null;

		await db.insert(inviteCodes).values({
			code: code.trim(),
			expiresAt
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
		const code = formData.get('code') as string;
		const isActive = formData.get('isActive') as string;
		const expiresAtRaw = formData.get('expiresAt') as string | null;

		if (!id) {
			return fail(400, { error: 'Invite code ID is required' });
		}

		if (!code || code.trim().length === 0) {
			return fail(400, { error: 'Code is required' });
		}

		const existing = await db.query.inviteCodes.findFirst({
			where: eq(inviteCodes.id, id)
		});

		if (!existing) {
			throw error(404, 'Invite code not found');
		}

		const expiresAt = expiresAtRaw && expiresAtRaw.trim() ? new Date(expiresAtRaw) : null;

		await db
			.update(inviteCodes)
			.set({
				code: code.trim(),
				isActive: isActive === 'true',
				expiresAt
			})
			.where(eq(inviteCodes.id, id));

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
			return fail(400, { error: 'Invite code ID is required' });
		}

		const existing = await db.query.inviteCodes.findFirst({
			where: eq(inviteCodes.id, id)
		});

		if (!existing) {
			throw error(404, 'Invite code not found');
		}

		await db.delete(inviteCodes).where(eq(inviteCodes.id, id));

		return { success: true };
	}
};
