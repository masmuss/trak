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
	url: string;
}

export interface NavItem {
	title: string;
	url: string;
	icon: Component;
	items?: NavSubItem[];
	adminOnly?: boolean;
}

export interface NavGroup {
	id: string;
	label: string;
	items: NavItem[];
}

export const navGroups: NavGroup[] = [
	{
		id: 'workspace',
		label: 'Workspace',
		items: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: ChartPieIcon
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
				]
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
				icon: UsersIcon
			},
			{
				title: 'Invite Codes',
				url: '/invite-codes',
				icon: KeyIcon
			},
			{
				title: 'Agents',
				url: '/agents',
				icon: ShieldIcon
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
				icon: GearSixIcon
			},
			{
				title: 'Audit Logs',
				url: '/audit-logs',
				icon: ShieldIcon,
				adminOnly: true
			}
		]
	}
];

export function visibleNavGroups(role?: string | null): NavGroup[] {
	if (role === 'admin') return navGroups;
	return navGroups
		.map((group) => ({
			...group,
			items: group.items.filter((item) => !item.adminOnly)
		}))
		.filter((group) => group.items.length > 0);
}
