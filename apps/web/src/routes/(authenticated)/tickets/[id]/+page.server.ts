import { error, fail } from '@sveltejs/kit';
import {
	getTicketById,
	updateTicketStatus,
	updateTicketPriority,
	createNotification
} from '@trak/services';
import type { PageServerLoad, Actions } from './$types';
import { priorityEnum } from '@trak/database';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

export const load: PageServerLoad = async (event) => {
	const ticket = await getTicketById(event.params.id);

	if (!ticket) {
		throw error(404, 'Ticket not found');
	}

	return {
		ticket,
		breadcrumbs: [
			{ label: 'Tickets', href: '/tickets' },
			{ label: `Ticket #TK-${ticket.id.slice(0, 8).toUpperCase()}` }
		]
	};
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

		const statusLabels: Record<string, string> = {
			open: '🔴 Open',
			in_progress: '🟡 In Progress',
			resolved: '🟢 Resolved',
			closed: '⚪ Closed'
		};

		const ticketCode = `TKT-${id.slice(0, 8).toUpperCase()}`;
		const oldLabel = statusLabels[ticket.status] ?? ticket.status;
		const newLabel = statusLabels[newStatus] ?? newStatus;

		await createNotification({
			reporterTelegramId: ticket.reporter.telegramId,
			reportId: id,
			message:
				`🔄 Status tiket ${ticketCode} diperbarui\n\n` +
				`Judul: ${ticket.title}\n` +
				`Status: ${oldLabel} → ${newLabel}` +
				(note ? `\nCatatan: ${note}` : '')
		});

		return { success: true };
	},

	updatePriority: async (event) => {
		const user = event.locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const { id } = event.params;
		const formData = await event.request.formData();
		const newPriority = formData.get('priority') as string;

		const validPriorities = priorityEnum.enumValues;
		if (!newPriority || !validPriorities.includes(newPriority as never)) {
			return fail(400, { error: 'Invalid priority value' });
		}

		const ticket = await getTicketById(id);
		if (!ticket) {
			throw error(404, 'Ticket not found');
		}

		if (ticket.priority === newPriority) {
			return fail(400, { error: 'Priority is already set to ' + newPriority });
		}

		await updateTicketPriority(id, newPriority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', user.id);

		const ticketCode = `TKT-${id.slice(0, 8).toUpperCase()}`;

		await createNotification({
			reporterTelegramId: ticket.reporter.telegramId,
			reportId: id,
			message:
				`🏷 Prioritas tiket ${ticketCode} diperbarui\n\n` +
				`Judul: ${ticket.title}\n` +
				`Prioritas: ${ticket.priority} → ${newPriority}`
		});

		return { success: true };
	}
};
