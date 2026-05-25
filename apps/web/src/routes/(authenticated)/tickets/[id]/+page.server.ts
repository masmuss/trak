import { error, fail } from '@sveltejs/kit';
import { getTicketById, updateTicketStatus } from '@trak/services';
import type { PageServerLoad, Actions } from './$types';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

export const load: PageServerLoad = async (event) => {
	const ticket = await getTicketById(event.params.id);

	if (!ticket) {
		throw error(404, 'Ticket not found');
	}

	return { ticket };
};

export const actions: Actions = {
	updateStatus: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const { id } = event.params;
		const formData = await event.request.formData();
		const newStatus = formData.get('status') as string;
		const note = formData.get('note') as string;

		if (!newStatus || !validStatuses.includes(newStatus)) {
			return fail(400, { error: 'Invalid status' });
		}

		const ticket = await getTicketById(id);

		if (!ticket) {
			throw error(404, 'Ticket not found');
		}

		if (ticket.status === newStatus) {
			return fail(400, { error: 'Status is already set to ' + newStatus });
		}

		await updateTicketStatus(id, newStatus, user.id, note || undefined);

		return { success: true };
	}
};
