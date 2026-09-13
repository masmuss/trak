import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	createInviteCode,
	deleteInviteCode,
	getInviteCodeById,
	getInviteCodes,
	updateInviteCode,
	createAuditLog
} from '@trak/services';
import {
	requireRole,
	getFormString,
	getFormNullableString,
	getFormBool,
	requireExists
} from '$lib/server/helpers';

export const load: PageServerLoad = async (event) => {
	requireRole(event, 'admin');
	const all = await getInviteCodes();
	return { inviteCodes: all };
};

export const actions: Actions = {
	create: async (event) => {
		const user = requireRole(event, 'admin');
		const formData = await event.request.formData();
		const code = getFormString(formData, 'code');
		const expiresAt = getFormNullableString(formData, 'expiresAt');

		if (!code.trim()) {
			return fail(400, { error: 'Code is required' });
		}

		const id = await createInviteCode({ code, expiresAt: expiresAt ? new Date(expiresAt) : null });
		await createAuditLog({
			actorUserId: user.id,
			action: 'invite_code.created',
			entityType: 'invite_code',
			entityId: id,
			afterData: { code, expiresAt }
		});

		return { success: true };
	},

	update: async (event) => {
		const user = requireRole(event, 'admin');
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
		await createAuditLog({
			actorUserId: user.id,
			action: 'invite_code.updated',
			entityType: 'invite_code',
			entityId: id,
			beforeData: existing,
			afterData: { code, isActive, expiresAt }
		});

		return { success: true };
	},

	delete: async (event) => {
		const user = requireRole(event, 'admin');
		const formData = await event.request.formData();
		const id = getFormString(formData, 'id');

		if (!id) {
			return fail(400, { error: 'Invite code ID is required' });
		}

		const existing = await getInviteCodeById(id);
		requireExists(existing, 'Invite code');

		await deleteInviteCode(id);
		await createAuditLog({
			actorUserId: user.id,
			action: 'invite_code.deleted',
			entityType: 'invite_code',
			entityId: id,
			beforeData: existing
		});

		return { success: true };
	}
};
