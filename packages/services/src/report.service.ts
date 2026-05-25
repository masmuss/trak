import { eq, and, or, count, sql } from 'drizzle-orm';
import { db, reports, statusHistories } from '@trak/database';
import type { Ticket, TicketDetails, TicketWithRelations, Category } from '@trak/shared';

export type TicketListItem = TicketWithRelations;

export type TicketListResult = {
	tickets: TicketListItem[];
	total: number;
};

export type TicketFilters = {
	status?: string;
	search?: string;
	categoryId?: string;
	limit?: number;
	offset?: number;
};

export async function getTicketById(id: string): Promise<TicketDetails | undefined> {
	return db.query.reports.findFirst({
		where: eq(reports.id, id),
		with: {
			reporter: true,
			category: true,
			attachments: true,
			statusHistories: {
				with: {
					changedByUser: true
				}
			}
		}
	}) as Promise<TicketDetails | undefined>;
}

export async function listTickets(filters: TicketFilters): Promise<TicketListResult> {
	const whereConditions = [];

	if (filters.status) {
		whereConditions.push(eq(reports.status, filters.status));
	}

	if (filters.categoryId) {
		whereConditions.push(eq(reports.categoryId, filters.categoryId));
	}

	if (filters.search) {
		whereConditions.push(
			or(
				sql`${reports.title} ILIKE ${'%' + filters.search + '%'}`,
				sql`${reports.body} ILIKE ${'%' + filters.search + '%'}`
			)
		);
	}

	const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

	const [totalResult, tickets] = await Promise.all([
		db
			.select({ count: count(reports.id) })
			.from(reports)
			.where(whereClause),
		db.query.reports.findMany({
			where: whereClause,
			limit: filters.limit ?? 10,
			offset: filters.offset ?? 0,
			with: { reporter: true, category: true },
			orderBy: (reports, { desc }) => [desc(reports.createdAt)]
		})
	]);

	return {
		tickets,
		total: totalResult[0]?.count ?? 0
	};
}

export async function getTicketByIdSimple(id: string): Promise<Ticket | undefined> {
	return db.query.reports.findFirst({
		where: eq(reports.id, id)
	}) as Promise<Ticket | undefined>;
}

export async function updateTicketStatus(
	id: string,
	newStatus: string,
	changedByUserId: string,
	note?: string
): Promise<void> {
	await db.transaction(async (tx) => {
		const existing = await tx.query.reports.findFirst({
			where: eq(reports.id, id)
		});

		if (!existing) {
			throw new Error('Ticket not found');
		}

		await tx.update(reports).set({ status: newStatus }).where(eq(reports.id, id));

		await tx.insert(statusHistories).values({
			reportId: id,
			changedBy: changedByUserId,
			oldStatus: existing.status,
			newStatus,
			note: note || null
		});
	});
}

export type CategoryDistribution = {
	categoryId: string;
	categoryName: string;
	count: number;
	percentage: number;
};

export type DistributionResult = {
	distribution: CategoryDistribution[];
	uncategorized: number;
};

export async function getCategoryDistribution(): Promise<DistributionResult> {
	const allReports = await db.query.reports.findMany({
		columns: { categoryId: true }
	});

	const allCategories = await db.query.categories.findMany();

	const countMap = new Map<string, number>();
	let uncategorized = 0;

	for (const r of allReports) {
		if (r.categoryId) {
			countMap.set(r.categoryId, (countMap.get(r.categoryId) ?? 0) + 1);
		} else {
			uncategorized++;
		}
	}

	const totalReports = allReports.length;

	const distribution = allCategories.map((cat) => {
		const count = countMap.get(cat.id) ?? 0;
		return {
			categoryId: cat.id,
			categoryName: cat.name,
			count,
			percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0
		};
	});

	return { distribution, uncategorized };
}
