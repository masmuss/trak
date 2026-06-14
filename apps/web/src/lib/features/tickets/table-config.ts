import type { TableConfig } from '$lib/components/shared/data-table';
import {
	createMultiSelectFilter,
	createSelectFilter,
	createSearchFilter
} from '$lib/components/shared/data-table';
import type { TicketWithRelations, Category } from '@trak/shared';

export function createTicketsTableConfig(categories: Category[]): TableConfig<TicketWithRelations> {
	const categoryOptions = categories.map((c) => ({
		label: c.name,
		value: c.id
	}));

	return {
		columns: [], // Will be set by Columns component

		filters: [
			createMultiSelectFilter({
				key: 'status',
				title: 'Status',
				serverKey: 'status',
				options: [
					{ label: 'Open', value: 'open' },
					{ label: 'In Progress', value: 'in_progress' },
					{ label: 'Resolved', value: 'resolved' },
					{ label: 'Closed', value: 'closed' }
				]
			}),
			createMultiSelectFilter({
				key: 'priority',
				title: 'Priority',
				serverKey: 'priority',
				options: [
					{ label: 'Critical', value: 'CRITICAL' },
					{ label: 'High', value: 'HIGH' },
					{ label: 'Medium', value: 'MEDIUM' },
					{ label: 'Low', value: 'LOW' }
				]
			}),
			createSelectFilter({
				key: 'sla_breached',
				title: 'SLA',
				serverKey: 'sla_breached',
				options: [
					{ label: 'Breached', value: 'true' },
					{ label: 'Safe', value: 'false' }
				]
			}),
			createMultiSelectFilter({
				key: 'categoryId',
				title: 'Category',
				serverKey: 'categoryId',
				options: categoryOptions
			}),
			createSearchFilter({
				key: 'search',
				title: 'Search',
				serverKey: 'search',
				placeholder: 'Search tickets...'
			})
		],

		export: {
			enabled: true,
			formats: ['csv'],
			filename: 'tickets-export'
		},

		features: {
			sorting: true,
			pagination: true,
			rowSelection: true,
			columnVisibility: true,
			search: true
		},

		defaults: {
			pageSize: 10,
			sorting: [],
			columnVisibility: {
				isSlaBreached: false,
				reporter: false
			}
		}
	};
}
