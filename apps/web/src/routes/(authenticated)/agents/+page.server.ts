import { fail } from '@sveltejs/kit';
import { hashPassword } from 'better-auth/crypto';
import type { PageServerLoad, Actions } from './$types';
import {
	createAccount,
	createUser,
	deleteUser,
	findUserByEmail,
	findUserByEmailExcluding,
	getActiveTicketCounts,
	getUserById,
	getUsers,
	updateUser,
	createAuditLog
} from '@trak/services';
import { requireRole, getFormString, getFormBool, requireExists } from '$lib/server/helpers';
import { isUserRole } from '@trak/shared';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generatePassword(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => CHARS[byte % CHARS.length]).join('');
}

export const load: PageServerLoad = async (event) => {
	requireRole(event, 'admin');
	const [allUsers, workload] = await Promise.all([getUsers(), getActiveTicketCounts()]);
	const activeByUser = new Map(workload.map((row) => [row.userId, row.activeTickets]));
	const agents = allUsers.map((agent) => ({
		...agent,
		activeTickets: activeByUser.get(agent.id) ?? 0
	}));
	return { agents };
};

export const actions: Actions = {
	create: async (event) => {
		const currentUser = requireRole(event, 'admin');
		const formData = await event.request.formData();
		const name = getFormString(formData, 'name');
		const email = getFormString(formData, 'email');
		const role = getFormString(formData, 'role') || 'agent';

		if (!name.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		if (!email.trim()) {
			return fail(400, { error: 'Email is required' });
		}
		if (!isUserRole(role)) {
			return fail(400, { error: 'Invalid role' });
		}

		const existingEmail = await findUserByEmail(email.trim());
		if (existingEmail) {
			return fail(400, { error: 'Email already in use' });
		}

		const password = generatePassword(12);
		const id = crypto.randomUUID();

		await createUser({
			id,
			name: name.trim(),
			email: email.trim(),
			role,
			isActive: true
		});

		await createAccount({
			id: crypto.randomUUID(),
			userId: id,
			accountId: id,
			providerId: 'credential',
			password: await hashPassword(password)
		});
		await createAuditLog({
			actorUserId: currentUser.id,
			action: 'user.created',
			entityType: 'user',
			entityId: id,
			afterData: { email: email.trim(), role, isActive: true }
		});

		return { success: true, password };
	},

	update: async (event) => {
		const currentUser = requireRole(event, 'admin');
		const formData = await event.request.formData();
		const id = getFormString(formData, 'id');
		const name = getFormString(formData, 'name');
		const email = getFormString(formData, 'email');
		const role = getFormString(formData, 'role') || 'agent';
		const isActive = getFormBool(formData, 'isActive');

		if (!id) {
			return fail(400, { error: 'Agent ID is required' });
		}

		if (!name.trim()) {
			return fail(400, { error: 'Name is required' });
		}

		if (!email.trim()) {
			return fail(400, { error: 'Email is required' });
		}
		if (!isUserRole(role)) {
			return fail(400, { error: 'Invalid role' });
		}

		const existing = await getUserById(id);
		requireExists(existing, 'Agent');

		const emailConflict = await findUserByEmailExcluding(email.trim(), id);
		if (emailConflict) {
			return fail(400, { error: 'Email already in use by another agent' });
		}

		await updateUser(id, {
			name: name.trim(),
			email: email.trim(),
			role,
			isActive
		});
		await createAuditLog({
			actorUserId: currentUser.id,
			action: 'user.updated',
			entityType: 'user',
			entityId: id,
			afterData: { name: name.trim(), email: email.trim(), role, isActive }
		});

		return { success: true };
	},

	delete: async (event) => {
		const currentUser = requireRole(event, 'admin');
		const formData = await event.request.formData();
		const id = getFormString(formData, 'id');

		if (!id) {
			return fail(400, { error: 'Agent ID is required' });
		}

		if (id === currentUser.id) {
			return fail(400, { error: 'Cannot delete your own account' });
		}

		const existing = await getUserById(id);
		requireExists(existing, 'Agent');

		await deleteUser(id);
		await createAuditLog({
			actorUserId: currentUser.id,
			action: 'user.deleted',
			entityType: 'user',
			entityId: id,
			beforeData: { name: existing.name, email: existing.email, role: existing.role }
		});

		return { success: true };
	}
};
