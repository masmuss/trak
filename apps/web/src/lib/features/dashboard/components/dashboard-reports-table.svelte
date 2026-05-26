<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import StatusBadge from '$lib/features/tickets/components/status-badge.svelte';
	import type { TicketWithRelations } from '@trak/shared';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { reports = [] }: { reports?: TicketWithRelations[] } = $props();
</script>

<Card.Root class="flex h-full flex-col overflow-hidden">
	<Card.Header>
		<Card.Title>Recent Reports</Card.Title>
		<Card.Description>Latest ticket submissions</Card.Description>
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
					<Table.Row
						class="cursor-pointer hover:bg-muted/50"
						onclick={() => goto(resolve('/(authenticated)/tickets/[id]', { id: report.id }))}
					>
						<Table.Cell class="font-mono font-medium text-primary">
							#{report.id.slice(0, 8)}
						</Table.Cell>
						<Table.Cell>{report.title}</Table.Cell>
						<Table.Cell class="text-muted-foreground">
							{report.category?.name ?? '—'}
						</Table.Cell>
						<Table.Cell>{report.reporter.fullName}</Table.Cell>
						<Table.Cell><StatusBadge status={report.status} /></Table.Cell>
						<Table.Cell class="text-muted-foreground">
							{new Date(report.createdAt).toLocaleDateString('en-ID', {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							})}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<Card.Footer class="justify-center">
		<Button variant="link" href={resolve('/(authenticated)/tickets')}>
			View All Active Tickets
		</Button>
	</Card.Footer>
</Card.Root>
