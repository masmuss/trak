import { error } from '@sveltejs/kit';
import { getTicketById, getUsers } from '@trak/services';
import type { PageServerLoad, Actions } from './$types';
import {
	claimTicketAction,
	assignTicketAction,
	updateStatusAction,
	sendMessageAction,
	updatePriorityAction
} from './ticket-action-handlers.server';

export const load: PageServerLoad = async (event) => {
	const ticket = await getTicketById(event.params.id);

	if (!ticket) {
		throw error(404, 'Ticket not found');
	}

	return {
		ticket,
		agents: (await getUsers()).filter((agent) => agent.isActive),
		currentUser: event.locals.user,
		breadcrumbs: [{ label: 'Tickets', href: '/tickets' }, { label: `Ticket #${ticket.ticketCode}` }]
	};
};

export const actions: Actions = {
	claim: claimTicketAction,
	assign: assignTicketAction,
	updateStatus: updateStatusAction,
	sendMessage: sendMessageAction,
	updatePriority: updatePriorityAction
};
