import { json } from '@sveltejs/kit';
import { getSlaCalendar } from '@trak/services';
import { requireAuth } from '$lib/server/helpers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	requireAuth(event);

	const year = Number(event.url.searchParams.get('year'));
	const month = Number(event.url.searchParams.get('month'));
	if (!Number.isInteger(year) || !Number.isInteger(month)) {
		return json({ error: 'year and month query params are required' }, { status: 400 });
	}

	try {
		return json(await getSlaCalendar(year, month));
	} catch {
		return json({ error: 'year or month out of range' }, { status: 400 });
	}
};
