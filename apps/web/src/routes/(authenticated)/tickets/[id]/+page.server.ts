import { error, fail } from '@sveltejs/kit';
import {
	getTicketById,
	updateTicketStatus,
	updateTicketPriority,
	createTicketMessage,
	createNotification
} from '@trak/services';
import type { PageServerLoad, Actions } from './$types';
import { priorityEnum } from '@trak/database';
import { requireAuth, requireExists } from '$lib/server/helpers';

const validStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const;

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
		breadcrumbs: [{ label: 'Tickets', href: '/tickets' }, { label: `Ticket #${ticket.ticketCode}` }]
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
				`🔄 Status tiket ${ticket.ticketCode} diperbarui\n\n` +
				`Judul: ${ticket.title}\n` +
				`Status: ${statusLabels[ticket.status]} → ${statusLabels[newStatus]}` +
				(note ? `\nCatatan: ${note}` : '')
		});

		return { success: true };
	},

	sendMessage: async (event) => {
		const user = requireAuth(event);
		const formData = await event.request.formData();
		const body = formData.get('body');
		const visibility = formData.get('visibility');

		if (typeof body !== 'string' || !body.trim()) {
			return fail(400, { error: 'Message cannot be empty' });
		}
		if (body.length > 5000) {
			return fail(400, { error: 'Message is too long' });
		}
		if (visibility !== 'public' && visibility !== 'internal') {
			return fail(400, { error: 'Invalid message type' });
		}

		const ticket = await getTicketById(event.params.id);
		requireExists(ticket, 'Ticket');
		if (ticket.status === 'closed') {
			return fail(400, { error: 'Closed tickets cannot receive messages' });
		}

		await createTicketMessage({
			reportId: ticket.id,
			senderType: 'agent',
			senderUserId: user.id,
			body,
			isInternal: visibility === 'internal'
		});

		if (visibility === 'public') {
			await createNotification({
				reporterTelegramId: ticket.reporter.telegramId,
				reportId: ticket.id,
				message: `💬 Balasan baru untuk tiket ${ticket.ticketCode}\n\n${body}`
			});
		}

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
				`🏷 Prioritas tiket ${ticket.ticketCode} diperbarui\n\n` +
				`Judul: ${ticket.title}\n` +
				`Prioritas: ${ticket.priority} → ${newPriority}`
		});

		return { success: true };
	}
};
