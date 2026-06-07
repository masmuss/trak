import { error, fail } from '@sveltejs/kit';
import {
	getTicketById,
	updateTicketStatus,
	updateTicketPriority,
	createNotification
} from '@trak/services';
import type { PageServerLoad, Actions } from './$types';
import { priorityEnum } from '@trak/database';
import { requireAuth, requireExists } from '$lib/server/helpers';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const;

function ticketCode(id: string) {
	return `TKT-${id.slice(0, 8).toUpperCase()}`;
}

const statusLabels: Record<string, string> = {
	open: '🔴 Open',
	in_progress: '🟡 In Progress',
	resolved: '🟢 Resolved',
	closed: '⚪ Closed'
};

export const load: PageServerLoad = async (event) => {
	const ticket = await getTicketById(event.params.id);

	if (!ticket) {
		throw error(404, 'Ticket not found');
	}

	return {
		ticket,
		breadcrumbs: [
			{ label: 'Tickets', href: '/tickets' },
			{ label: `Ticket #${ticketCode(ticket.id)}` }
		]
	};
};

export const actions: Actions = {
	updateStatus: async (event) => {
		const user = requireAuth(event);
		const { id } = event.params;
		const formData = await event.request.formData();
		const newStatus = formData.get('status') as string;
		const note = formData.get('note') as string;

		if (!newStatus || !validStatuses.includes(newStatus as never)) {
			return fail(400, { error: 'Invalid status' });
		}

		const ticket = await getTicketById(id);
		requireExists(ticket, 'Ticket');

		if (ticket.status === newStatus) {
			return fail(400, { error: 'Status is already set to ' + newStatus });
		}

		await updateTicketStatus(id, newStatus, user.id, note || undefined);

		await createNotification({
			reporterTelegramId: ticket.reporter.telegramId,
			reportId: id,
			message:
				`🔄 Status tiket ${ticketCode(ticket.id)} diperbarui\n\n` +
				`Judul: ${ticket.title}\n` +
				`Status: ${statusLabels[ticket.status]} → ${statusLabels[newStatus]}` +
				(note ? `\nCatatan: ${note}` : '')
		});

		return { success: true };
	},

	updatePriority: async (event) => {
		const user = requireAuth(event);
		const { id } = event.params;
		const formData = await event.request.formData();
		const newPriority = formData.get('priority') as string;

		const validPriorities = priorityEnum.enumValues;
		if (!newPriority || !validPriorities.includes(newPriority as never)) {
			return fail(400, { error: 'Invalid priority value' });
		}

		const ticket = await getTicketById(id);
		requireExists(ticket, 'Ticket');

		if (ticket.priority === newPriority) {
			return fail(400, { error: 'Priority is already set to ' + newPriority });
		}

		await updateTicketPriority(id, newPriority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', user.id);

		await createNotification({
			reporterTelegramId: ticket.reporter.telegramId,
			reportId: id,
			message:
				`🏷 Prioritas tiket ${ticketCode(ticket.id)} diperbarui\n\n` +
				`Judul: ${ticket.title}\n` +
				`Prioritas: ${ticket.priority} → ${newPriority}`
		});

		return { success: true };
	}
};
