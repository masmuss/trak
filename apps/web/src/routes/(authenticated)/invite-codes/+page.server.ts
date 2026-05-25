import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	createInviteCode,
	deleteInviteCode,
	getInviteCodeById,
	getInviteCodes,
	updateInviteCode
} from '@trak/services';

export const load: PageServerLoad = async () => {
	const all = await getInviteCodes();

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

		await createInviteCode({ code, expiresAt });

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

		const existing = await getInviteCodeById(id);

		if (!existing) {
			throw error(404, 'Invite code not found');
		}

		const expiresAt = expiresAtRaw && expiresAtRaw.trim() ? new Date(expiresAtRaw) : null;

		await updateInviteCode(id, {
			code,
			isActive: isActive === 'true',
			expiresAt
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
			return fail(400, { error: 'Invite code ID is required' });
		}

		const existing = await getInviteCodeById(id);

		if (!existing) {
			throw error(404, 'Invite code not found');
		}

		await deleteInviteCode(id);

		return { success: true };
	}
};
