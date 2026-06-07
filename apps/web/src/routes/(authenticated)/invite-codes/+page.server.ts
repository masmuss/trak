import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	createInviteCode,
	deleteInviteCode,
	getInviteCodeById,
	getInviteCodes,
	updateInviteCode
} from '@trak/services';
import {
	requireAuth,
	getFormString,
	getFormNullableString,
	getFormBool,
	requireExists
} from '$lib/server/helpers';

export const load: PageServerLoad = async () => {
	const all = await getInviteCodes();
	return { inviteCodes: all };
};

export const actions: Actions = {
	create: async (event) => {
		requireAuth(event);
		const formData = await event.request.formData();
		const code = getFormString(formData, 'code');
		const expiresAt = getFormNullableString(formData, 'expiresAt');

		if (!code.trim()) {
			return fail(400, { error: 'Code is required' });
		}

		await createInviteCode({ code, expiresAt: expiresAt ? new Date(expiresAt) : null });

		return { success: true };
	},

	update: async (event) => {
		requireAuth(event);
		const formData = await event.request.formData();
		const id = getFormString(formData, 'id');
		const code = getFormString(formData, 'code');
		const isActive = getFormBool(formData, 'isActive');
		const expiresAt = getFormNullableString(formData, 'expiresAt');

		if (!id) {
			return fail(400, { error: 'Invite code ID is required' });
		}

		if (!code.trim()) {
			return fail(400, { error: 'Code is required' });
		}

		const existing = await getInviteCodeById(id);
		requireExists(existing, 'Invite code');

		await updateInviteCode(id, {
			code,
			isActive,
			expiresAt: expiresAt ? new Date(expiresAt) : null
		});

		return { success: true };
	},

	delete: async (event) => {
		requireAuth(event);
		const formData = await event.request.formData();
		const id = getFormString(formData, 'id');

		if (!id) {
			return fail(400, { error: 'Invite code ID is required' });
		}

		const existing = await getInviteCodeById(id);
		requireExists(existing, 'Invite code');

		await deleteInviteCode(id);

		return { success: true };
	}
};
