import { getStatusLabel, type TicketDetails } from '@trak/shared';

/**
 * Pure presenter: renders a TicketDetails into a Telegram message.
 * No service calls, no ctx — conversation handlers only pass data through.
 */
export function formatTicketStatusMessage(ticketCode: string, ticket: TicketDetails): string {
	const history =
		ticket.statusHistories.length > 0
			? '\n\nRiwayat Status:\n' +
				ticket.statusHistories
					.map(
						(h) =>
							`${h.changedAt.toLocaleString('id-ID')} — ${getStatusLabel(h.oldStatus)} → ${getStatusLabel(h.newStatus)}` +
							(h.note ? ` (${h.note})` : '') +
							` oleh ${h.changedByUser?.name ?? 'Sistem'}`
					)
					.join('\n')
			: '';

	return (
		`📋 Tiket ${ticketCode}\n\n` +
		`${ticket.title}\n\n` +
		`${ticket.body}\n\n` +
		`Status: ${getStatusLabel(ticket.status)}` +
		` | Kategori: ${ticket.category?.name ?? '-'}` +
		` | Lampiran: ${ticket.attachments.length}` +
		`\nDibuat: ${ticket.createdAt.toLocaleString('id-ID')}` +
		(ticket.updatedAt ? `\nDiperbarui: ${ticket.updatedAt.toLocaleString('id-ID')}` : '') +
		history
	);
}
