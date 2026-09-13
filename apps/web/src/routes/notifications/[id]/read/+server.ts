import { markAgentNotificationRead } from '@trak/services';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	await markAgentNotificationRead(params.id, locals.user.id);
	return json({ success: true });
};
