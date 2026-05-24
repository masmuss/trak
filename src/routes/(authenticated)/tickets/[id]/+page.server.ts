import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reports, statusHistories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const { id } = event.params;

	const ticket = await db.query.reports.findFirst({
		where: eq(reports.id, id),
		with: {
			reporter: true,
			category: true,
			attachments: true,
			statusHistories: {
				with: {
					changedByUser: true
				},
				orderBy: (statusHistories, { desc }) => [desc(statusHistories.changedAt)]
			}
		}
	});

	if (!ticket) {
		throw error(404, 'Ticket not found');
	}

	return {
		ticket
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

		const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
		if (!newStatus || !validStatuses.includes(newStatus)) {
			return fail(400, { error: 'Invalid status' });
		}

		const ticket = await db.query.reports.findFirst({
			where: eq(reports.id, id)
		});

		if (!ticket) {
			throw error(404, 'Ticket not found');
		}

		const oldStatus = ticket.status;

		if (oldStatus === newStatus) {
			return fail(400, { error: 'Status is already set to ' + newStatus });
		}

		await db.transaction(async (tx) => {
			await tx.update(reports).set({ status: newStatus }).where(eq(reports.id, id));

			await tx.insert(statusHistories).values({
				reportId: id,
				changedBy: user.id,
				oldStatus,
				newStatus,
				note: note || null
			});
		});

		return { success: true };
	}
};
