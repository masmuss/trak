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
	<Card.Content class="flex-1 overflow-auto">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Subject</Table.Head>
					<Table.Head class="hidden sm:table-cell">Category</Table.Head>
					<Table.Head>Reporter</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="hidden text-right md:table-cell">Date</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each reports as report (report.id)}
					<Table.Row
						class="cursor-pointer hover:bg-muted/50"
						onclick={() => goto(resolve('/(authenticated)/tickets/[id]', { id: report.id }))}
					>
						<Table.Cell class="font-medium">{report.title}</Table.Cell>
						<Table.Cell class="hidden text-muted-foreground sm:table-cell">
							{report.category?.name ?? '—'}
						</Table.Cell>
						<Table.Cell>{report.reporter.fullName}</Table.Cell>
						<Table.Cell><StatusBadge status={report.status} /></Table.Cell>
						<Table.Cell class="hidden text-right text-muted-foreground md:table-cell">
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
	</Card.Content>
	<Card.Footer class="justify-center">
		<Button variant="link" href={resolve('/(authenticated)/tickets')}>
			View All Active Tickets
		</Button>
	</Card.Footer>
</Card.Root>
