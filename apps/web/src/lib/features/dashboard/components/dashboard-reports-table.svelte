<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { FunnelIcon, DownloadSimpleIcon } from 'phosphor-svelte';
	import StatusBadge from '$lib/features/tickets/components/status-badge.svelte';

	type ReportRow = {
		id: string;
		subject: string;
		category: string;
		reporter: string;
		status: string;
		date: string;
	};

	const defaultReports: ReportRow[] = [
		{
			id: '#TK-8402',
			subject: 'Login API Latency issues',
			category: 'Infrastructure',
			reporter: 'Jane Doe',
			status: 'in_progress',
			date: 'Oct 24, 2023'
		},
		{
			id: '#TK-8399',
			subject: 'UI Glitch in Reports View',
			category: 'Frontend',
			reporter: 'Mike Smith',
			status: 'resolved',
			date: 'Oct 23, 2023'
		},
		{
			id: '#TK-8395',
			subject: 'Bulk invite feature missing',
			category: 'Feature Request',
			reporter: 'Alan Kay',
			status: 'open',
			date: 'Oct 23, 2023'
		},
		{
			id: '#TK-8390',
			subject: 'Database backup failed',
			category: 'Security',
			reporter: 'System Monitor',
			status: 'open',
			date: 'Oct 22, 2023'
		}
	];

	let { reports = defaultReports }: { reports?: ReportRow[] } = $props();
</script>

<Card.Root class="flex h-full flex-col overflow-hidden">
	<Card.Header>
		<div class="flex items-center justify-between">
			<div>
				<Card.Title>Recent Reports</Card.Title>
				<Card.Description>Latest ticket submissions</Card.Description>
			</div>
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon-sm">
					<FunnelIcon />
					<span class="sr-only">Filter</span>
				</Button>
				<Button variant="ghost" size="icon-sm">
					<DownloadSimpleIcon />
					<span class="sr-only">Download</span>
				</Button>
			</div>
		</div>
	</Card.Header>
	<div class="flex-1 overflow-auto">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Ticket ID</Table.Head>
					<Table.Head>Subject</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head>Reporter</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Date</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each reports as report (report.id)}
					<Table.Row class="cursor-pointer hover:bg-muted/50">
						<Table.Cell class="font-medium text-primary">{report.id}</Table.Cell>
						<Table.Cell>{report.subject}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{report.category}</Table.Cell>
						<Table.Cell>{report.reporter}</Table.Cell>
						<Table.Cell><StatusBadge status={report.status} /></Table.Cell>
						<Table.Cell class="text-muted-foreground">{report.date}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<Card.Footer class="justify-center border-t">
		<Button variant="link">View All Active Reports</Button>
	</Card.Footer>
</Card.Root>
