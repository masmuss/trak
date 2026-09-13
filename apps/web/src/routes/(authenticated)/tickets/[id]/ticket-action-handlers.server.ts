import { error, fail, type RequestEvent } from '@sveltejs/kit';
import {
	assignTicket,
	claimTicket,
	createAgentNotification,
	createAuditLog,
	createNotification,
	createTicketMessage,
	getTicketById,
	updateTicketPriority,
	updateTicketStatus
} from '@trak/services';
import {
	getStatusLabel,
	isPriority,
	isTicketStatus,
	MAX_ATTACHMENT_SIZE,
	MAX_ATTACHMENTS,
	MAX_MESSAGE_LENGTH
} from '@trak/shared';
import { getFormString, requireExists, requireRole, toActor } from '$lib/server/helpers';
import { uploadAttachment } from '$lib/server/storage';

function getAttachments(formData: FormData): File[] {
	return formData
		.getAll('attachments')
		.filter((value): value is File => value instanceof File && value.size > 0);
}

function getTicketId(event: RequestEvent): string {
	const id = event.params.id;
	if (!id) throw error(400, 'Ticket id is required');
	return id;
}

export async function claimTicketAction(event: RequestEvent) {
	const user = requireRole(event, 'agent', 'admin');
	const id = getTicketId(event);
	const claimed = await claimTicket(id, toActor(user));
	if (!claimed) {
		return fail(409, { error: 'Ticket is already assigned' });
	}

	await createAuditLog({
		actorUserId: user.id,
		action: 'ticket.assigned',
		entityType: 'ticket',
		entityId: id,
		afterData: { assignedTo: user.id, method: 'claim' }
	});
	await createAgentNotification({
		recipientUserId: user.id,
		reportId: id,
		type: 'assignment',
		message: `Ticket ${id} berhasil di-claim`
	});

	return { success: true };
}

export async function assignTicketAction(event: RequestEvent) {
	const user = requireRole(event, 'admin');
	const id = getTicketId(event);
	const formData = await event.request.formData();
	const assigneeId = formData.get('assigneeId');
	if (assigneeId !== null && typeof assigneeId !== 'string') {
		return fail(400, { error: 'Invalid assignee' });
	}

	const ticket = await getTicketById(id);
	requireExists(ticket, 'Ticket');
	await assignTicket(id, assigneeId || null, toActor(user));
	await createAuditLog({
		actorUserId: user.id,
		action: 'ticket.assigned',
		entityType: 'ticket',
		entityId: id,
		beforeData: { assignedTo: ticket.assignee?.id ?? null },
		afterData: { assignedTo: assigneeId || null, method: 'manual' }
	});

	if (assigneeId) {
		await createAgentNotification({
			recipientUserId: assigneeId,
			reportId: id,
			type: 'assignment',
			message: `Ticket ${id} ditugaskan kepada Anda`
		});
	}

	return { success: true };
}

export async function updateStatusAction(event: RequestEvent) {
	const user = requireRole(event, 'agent', 'admin');
	const id = getTicketId(event);
	const formData = await event.request.formData();
	const newStatus = getFormString(formData, 'status');
	const note = getFormString(formData, 'note');

	if (!isTicketStatus(newStatus)) {
		return fail(400, { error: 'Invalid status' });
	}

	const ticket = await getTicketById(id);
	requireExists(ticket, 'Ticket');
	if (ticket.status === newStatus) {
		return fail(400, { error: `Status is already set to ${newStatus}` });
	}

	await updateTicketStatus(id, newStatus, toActor(user), note || undefined);
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
			`Status: ${getStatusLabel(ticket.status)} → ${getStatusLabel(newStatus)}` +
			(note ? `\nCatatan: ${note}` : '')
	});

	return { success: true };
}

export async function sendMessageAction(event: RequestEvent) {
	const user = requireRole(event, 'agent', 'admin');
	const id = getTicketId(event);
	const formData = await event.request.formData();
	const body = getFormString(formData, 'body');
	const visibility = getFormString(formData, 'visibility');
	const files = getAttachments(formData);

	if (body.length > MAX_MESSAGE_LENGTH) {
		return fail(400, { error: 'Message is too long' });
	}
	if (!body.trim() && files.length === 0) {
		return fail(400, { error: 'Message or attachment is required' });
	}
	if (files.length > MAX_ATTACHMENTS || files.some((file) => file.size > MAX_ATTACHMENT_SIZE)) {
		return fail(400, { error: 'Maximum 5 attachments, 10 MB per file' });
	}
	if (visibility !== 'public' && visibility !== 'internal') {
		return fail(400, { error: 'Invalid message type' });
	}

	const ticket = await getTicketById(id);
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
}

export async function updatePriorityAction(event: RequestEvent) {
	const user = requireRole(event, 'admin');
	const id = getTicketId(event);
	const formData = await event.request.formData();
	const newPriority = getFormString(formData, 'priority');

	if (!isPriority(newPriority)) {
		return fail(400, { error: 'Invalid priority value' });
	}

	const ticket = await getTicketById(id);
	requireExists(ticket, 'Ticket');
	if (ticket.priority === newPriority) {
		return fail(400, { error: `Priority is already set to ${newPriority}` });
	}

	await updateTicketPriority(id, newPriority, toActor(user));
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
