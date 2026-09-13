import { and, asc, count, desc, eq, inArray, isNull, lt, sql, type SQL } from 'drizzle-orm';
import { db, reports } from '@trak/database';
import { toPriorityList, toTicketStatusList } from '@trak/shared';
import type { Ticket, TicketDetails } from '@trak/shared';
import type {
	CategoryDistribution,
	DistributionResult,
	TicketFilters,
	TicketListItem,
	TicketListResult,
	TicketSortKey,
	TicketStats
} from './report.types';

type ReportFilterInput = Pick<
	TicketFilters,
	| 'status'
	| 'priority'
	| 'slaBreached'
	| 'staleHours'
	| 'search'
	| 'categoryId'
	| 'assignedTo'
	| 'sort'
	| 'order'
>;

const TICKET_SORT_KEYS: readonly TicketSortKey[] = [
	'createdAt',
	'ticketCode',
	'title',
	'status',
	'priority',
	'slaResolveDue',
	'lastActivityAt'
];

export function isTicketSortKey(value: unknown): value is TicketSortKey {
	return typeof value === 'string' && (TICKET_SORT_KEYS as readonly string[]).includes(value);
}

function resolveTicketOrder(filters: Pick<TicketFilters, 'sort' | 'order'>): SQL {
	const ascending = filters.order === 'asc';
	switch (filters.sort) {
		case 'ticketCode':
			return ascending ? asc(reports.ticketCode) : desc(reports.ticketCode);
		case 'title':
			return ascending ? asc(reports.title) : desc(reports.title);
		case 'status':
			return ascending ? asc(reports.status) : desc(reports.status);
		case 'slaResolveDue':
			return ascending ? asc(reports.slaResolveDue) : desc(reports.slaResolveDue);
		case 'lastActivityAt':
			return ascending ? asc(reports.lastActivityAt) : desc(reports.lastActivityAt);
		case 'priority': {
			const severity = sql`CASE ${reports.priority} WHEN 'CRITICAL' THEN 0 WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 ELSE 4 END`;
			return ascending ? asc(severity) : desc(severity);
		}
		case 'createdAt':
		default:
			return ascending ? asc(reports.createdAt) : desc(reports.createdAt);
	}
}

export function parseStaleHours(value: unknown): number | undefined {
	const hours = typeof value === 'string' ? Number(value) : value;
	if (typeof hours !== 'number' || !Number.isFinite(hours) || hours <= 0) return undefined;
	return hours;
}

function staleCondition(hours: number): SQL | undefined {
	return and(
		inArray(reports.status, toTicketStatusList('open,in_progress')),
		lt(reports.lastActivityAt, new Date(Date.now() - hours * 3_600_000))
	);
}

function buildReportFilters(filters: ReportFilterInput): SQL | undefined {
	const conditions: SQL[] = [];

	const statuses = toTicketStatusList(filters.status);
	if (statuses.length > 0) conditions.push(inArray(reports.status, statuses));
	const priorities = toPriorityList(filters.priority);
	if (priorities.length > 0) conditions.push(inArray(reports.priority, priorities));

	if (filters.slaBreached === 'true') conditions.push(eq(reports.isSlaBreached, true));
	if (filters.slaBreached === 'false') conditions.push(eq(reports.isSlaBreached, false));

	const staleHours = parseStaleHours(filters.staleHours);
	if (staleHours !== undefined) {
		const stale = staleCondition(staleHours);
		if (stale) conditions.push(stale);
	}
	if (filters.categoryId)
		conditions.push(inArray(reports.categoryId, filters.categoryId.split(',')));

	if (filters.assignedTo) {
		conditions.push(
			filters.assignedTo === 'unassigned'
				? isNull(reports.assignedTo)
				: inArray(reports.assignedTo, filters.assignedTo.split(','))
		);
	}

	if (filters.search) {
		conditions.push(
			sql`(${reports.title} ILIKE ${'%' + filters.search + '%'} OR ${reports.body} ILIKE ${'%' + filters.search + '%'})`
		);
	}

	return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getTicketById(id: string): Promise<TicketDetails | undefined> {
	return db.query.reports.findFirst({
		where: eq(reports.id, id),
		with: {
			reporter: true,
			category: true,
			attachments: true,
			assignee: true,
			statusHistories: {
				with: { changedByUser: true },
				orderBy: (statusHistories, { desc }) => [desc(statusHistories.changedAt)]
			},
			messages: {
				with: { senderUser: true, senderReporter: true, attachments: true },
				orderBy: (ticketMessages, { asc }) => [asc(ticketMessages.createdAt)]
			}
		}
	});
}

export async function getTicketByIdSimple(id: string): Promise<Ticket | undefined> {
	return db.query.reports.findFirst({ where: eq(reports.id, id) });
}

export async function getTicketByTicketCode(code: string): Promise<TicketDetails | undefined> {
	return db.query.reports.findFirst({
		where: eq(reports.ticketCode, code.toUpperCase()),
		with: {
			reporter: true,
			category: true,
			attachments: true,
			assignee: true,
			statusHistories: {
				with: { changedByUser: true },
				orderBy: (statusHistories, { desc }) => [desc(statusHistories.changedAt)]
			},
			messages: {
				with: { senderUser: true, senderReporter: true, attachments: true },
				orderBy: (ticketMessages, { asc }) => [asc(ticketMessages.createdAt)]
			}
		}
	});
}

export async function getTicketByTicketCodeForReporter(
	code: string,
	reporterId: string
): Promise<TicketDetails | undefined> {
	const ticket = await getTicketByTicketCode(code);
	return ticket?.reporterId === reporterId ? ticket : undefined;
}

export async function listTickets(filters: TicketFilters): Promise<TicketListResult> {
	const whereClause = buildReportFilters(filters);
	const [totalResult, tickets] = await Promise.all([
		db
			.select({ count: count(reports.id) })
			.from(reports)
			.where(whereClause),
		db.query.reports.findMany({
			where: whereClause,
			limit: filters.limit ?? 10,
			offset: filters.offset ?? 0,
			with: { reporter: true, category: true, assignee: true },
			orderBy: [resolveTicketOrder(filters)]
		})
	]);

	return { tickets, total: totalResult[0]?.count ?? 0 };
}

export async function getTicketsForExport(filters: ReportFilterInput): Promise<TicketListItem[]> {
	return db.query.reports.findMany({
		where: buildReportFilters(filters),
		with: { reporter: true, category: true, assignee: true },
		orderBy: [resolveTicketOrder(filters)]
	});
}

/**
 * Open tickets with no meaningful activity (status/priority/assignment/edit/message)
 * for longer than `maxInactiveHours`. SLA bookkeeping flips and session noise do not
 * count — `last_activity_at` is maintained by DB triggers (see migration 0017).
 */
export async function getStaleTickets(
	maxInactiveHours: number,
	limit = 50
): Promise<TicketListItem[]> {
	if (parseStaleHours(maxInactiveHours) === undefined) {
		throw new Error('maxInactiveHours must be a positive number');
	}
	return db.query.reports.findMany({
		where: staleCondition(maxInactiveHours),
		with: { reporter: true, category: true, assignee: true },
		orderBy: [asc(reports.lastActivityAt)],
		limit
	});
}

export async function getTicketStats(): Promise<TicketStats> {
	const stats = await db
		.select({
			total: count(),
			pending: sql<number>`count(*) FILTER (WHERE status IN ('open', 'in_progress'))`,
			solved: sql<number>`count(*) FILTER (WHERE status IN ('resolved', 'closed'))`
		})
		.from(reports);

	return stats[0] ?? { total: 0, pending: 0, solved: 0 };
}

export async function getCategoryDistribution(): Promise<DistributionResult> {
	const [allReports, allCategories] = await Promise.all([
		db.query.reports.findMany({ columns: { categoryId: true } }),
		db.query.categories.findMany()
	]);
	const countMap = new Map<string, number>();
	let uncategorized = 0;

	for (const report of allReports) {
		if (report.categoryId) {
			countMap.set(report.categoryId, (countMap.get(report.categoryId) ?? 0) + 1);
		} else {
			uncategorized++;
		}
	}

	const totalReports = allReports.length;
	const distribution: CategoryDistribution[] = allCategories.map((category) => {
		const categoryCount = countMap.get(category.id) ?? 0;
		return {
			categoryId: category.id,
			categoryName: category.name,
			count: categoryCount,
			percentage: totalReports > 0 ? Math.round((categoryCount / totalReports) * 100) : 0
		};
	});

	return { distribution, uncategorized };
}
