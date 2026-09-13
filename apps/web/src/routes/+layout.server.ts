import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getAgentNotifications, getUnreadAgentNotificationCount } from '@trak/services';

export const load: LayoutServerLoad = async (event) => {
	if (event.url.pathname !== '/login' && !event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.url.pathname === '/login' && event.locals.user) {
		return redirect(302, '/dashboard');
	}

	if (!event.locals.user) return { user: null, notifications: [], unreadNotificationCount: 0 };

	const [notifications, unreadNotificationCount] = await Promise.all([
		getAgentNotifications(event.locals.user.id),
		getUnreadAgentNotificationCount(event.locals.user.id)
	]);

	return { user: event.locals.user, notifications, unreadNotificationCount };
};
