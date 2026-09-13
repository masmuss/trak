import { getAuditLogs } from '@trak/services';
import type { PageServerLoad } from './$types';
import { requireRole } from '$lib/server/helpers';

export const load: PageServerLoad = async (event) => {
	requireRole(event, 'admin');

	const action = event.url.searchParams.get('action') || undefined;
	const entityType = event.url.searchParams.get('entityType') || undefined;
	const search = event.url.searchParams.get('search') || undefined;
	const logs = await getAuditLogs({ action, entityType, search });

	return {
		logs,
		filters: { action: action ?? '', entityType: entityType ?? '', search: search ?? '' }
	};
};
