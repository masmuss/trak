import {
	ChartPieIcon,
	TicketIcon,
	UsersIcon,
	KeyIcon,
	ShieldIcon,
	GearSixIcon
} from 'phosphor-svelte';
import type { Component } from 'svelte';

export interface NavSubItem {
	title: string;
	url: NavHref;
}

export interface NavItem {
	title: string;
	url: NavHref;
	icon: Component;
	items?: NavSubItem[];
	adminOnly?: boolean;
}

export interface NavGroup {
	id: string;
	label: string;
	items: NavItem[];
}

// Every item below is checked against this union at compile time:
// adding a URL to the data without listing it here fails the build,
// which keeps resolve() calls type-safe (it only accepts literal routes).
export type NavHref =
	| '/dashboard'
	| '/tickets'
	| '/tickets?status=open'
	| '/tickets?status=in_progress'
	| '/tickets?status=resolved'
	| '/reporters'
	| '/invite-codes'
	| '/agents'
	| '/settings'
	| '/audit-logs';

// Every item carries `items` + `adminOnly` explicitly so the inferred
// literal types stay indexable (optional props would splinter the union).
export const navGroups: NavGroup[] = [
	{
		id: 'workspace',
		label: 'Workspace',
		items: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: ChartPieIcon,
				items: [],
				adminOnly: false
			},
			{
				title: 'Tickets',
				url: '/tickets',
				icon: TicketIcon,
				items: [
					{ title: 'All Tickets', url: '/tickets' },
					{ title: 'Open', url: '/tickets?status=open' },
					{ title: 'In Progress', url: '/tickets?status=in_progress' },
					{ title: 'Resolved', url: '/tickets?status=resolved' }
				],
				adminOnly: false
			}
		]
	},
	{
		id: 'management',
		label: 'Management',
		items: [
			{
				title: 'Reporters',
				url: '/reporters',
				icon: UsersIcon,
				items: [],
				adminOnly: false
			},
			{
				title: 'Invite Codes',
				url: '/invite-codes',
				icon: KeyIcon,
				items: [],
				adminOnly: false
			},
			{
				title: 'Agents',
				url: '/agents',
				icon: ShieldIcon,
				items: [],
				adminOnly: false
			}
		]
	},
	{
		id: 'system',
		label: 'System',
		items: [
			{
				title: 'Settings',
				url: '/settings',
				icon: GearSixIcon,
				items: [],
				adminOnly: false
			},
			{
				title: 'Audit Logs',
				url: '/audit-logs',
				icon: ShieldIcon,
				items: [],
				adminOnly: true
			}
		]
	}
] satisfies NavGroup[];

export function visibleNavGroups(role?: string | null): NavGroup[] {
	if (role === 'admin') return navGroups;
	return navGroups
		.map((group) => ({
			...group,
			items: group.items.filter((item) => !item.adminOnly)
		}))
		.filter((group) => group.items.length > 0);
}
