import { error, fail } from '@sveltejs/kit';
import {
	getTicketById,
	updateTicketStatus,
	updateTicketPriority,
	createTicketMessage,
	createNotification,
	createAuditLog
} from '@trak/services';
import type { PageServerLoad, Actions } from './$types';
import { priorityEnum } from '@trak/database';
import { requireRole, requireExists } from '$lib/server/helpers';
import { uploadAttachment } from '$lib/server/storage';

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
		const user = requireRole(event, 'agent', 'admin');
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
		await createAuditLog({
			actorUserId: user.id,
			action: 'ticket.status_changed',
			entityType: 'ticket',
			entityId: id,
			beforeData: { status: ticket.status },
			afterData: { status: newStatus, note: note || null }
		});

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
		const user = requireRole(event, 'agent', 'admin');
		const formData = await event.request.formData();
		const body = formData.get('body');
		const visibility = formData.get('visibility');
		const files = formData
			.getAll('attachments')
			.filter((value): value is File => value instanceof File && value.size > 0);

		if (typeof body !== 'string') {
			return fail(400, { error: 'Message is required' });
		}
		if (body.length > 5000) {
			return fail(400, { error: 'Message is too long' });
		}
		if (!body.trim() && files.length === 0) {
			return fail(400, { error: 'Message or attachment is required' });
		}
		if (files.length > 5 || files.some((file) => file.size > 10 * 1024 * 1024)) {
			return fail(400, { error: 'Maximum 5 attachments, 10 MB per file' });
		}
		if (visibility !== 'public' && visibility !== 'internal') {
			return fail(400, { error: 'Invalid message type' });
		}

		const ticket = await getTicketById(event.params.id);
		requireExists(ticket, 'Ticket');
		if (ticket.status === 'closed') {
			return fail(400, { error: 'Closed tickets cannot receive messages' });
		}

		const attachments = await Promise.all(files.map(uploadAttachment));
		await createTicketMessage({
			reportId: ticket.id,
			senderType: 'agent',
			senderUserId: user.id,
			body,
			isInternal: visibility === 'internal',
			attachments
		});
		await createAuditLog({
			actorUserId: user.id,
			action: 'ticket.message_created',
			entityType: 'ticket_message',
			entityId: ticket.id,
			afterData: { visibility, attachmentCount: attachments.length }
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
		const user = requireRole(event, 'admin');
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
		await createAuditLog({
			actorUserId: user.id,
			action: 'ticket.priority_changed',
			entityType: 'ticket',
			entityId: id,
			beforeData: { priority: ticket.priority },
			afterData: { priority: newPriority }
		});

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
