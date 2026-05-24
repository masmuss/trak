// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async (event: Parameters<LayoutServerLoad>[0]) => {
	if (event.url.pathname !== '/login' && !event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.url.pathname === '/login' && event.locals.user) {
		return redirect(302, '/dashboard');
	}

	return { user: event.locals.user };
};
