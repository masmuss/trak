import { markAllAgentNotificationsRead } from '@trak/services';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	await markAllAgentNotificationsRead(locals.user.id);
	return json({ success: true });
};
