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
		<Card.Title class="leading-none">Recent Reports</Card.Title>
		<Card.Description>Latest ticket submissions</Card.Description>
		<Card.Action>
			<Button variant="outline" size="sm" href={resolve('/(authenticated)/tickets')}>
				View All
			</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content class="flex-1 overflow-auto pt-0">
		<div class="overflow-hidden rounded-lg border bg-card">
			<Table.Root>
				<Table.Header class="bg-muted/15">
					<Table.Row>
						<Table.Head class="h-11 p-3 font-medium">Subject</Table.Head>
						<Table.Head class="hidden h-11 p-3 font-medium sm:table-cell">Category</Table.Head>
						<Table.Head class="h-11 p-3 font-medium">Reporter</Table.Head>
						<Table.Head class="h-11 p-3 font-medium">Status</Table.Head>
						<Table.Head class="hidden h-11 p-3 text-right font-medium md:table-cell"
							>Date</Table.Head
						>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each reports as report (report.id)}
						<Table.Row
							class="cursor-pointer hover:bg-muted/50"
							onclick={() => goto(resolve('/(authenticated)/tickets/[id]', { id: report.id }))}
						>
							<Table.Cell class="p-3 align-middle font-medium">{report.title}</Table.Cell>
							<Table.Cell class="hidden p-3 align-middle text-muted-foreground sm:table-cell">
								{report.category?.name ?? '—'}
							</Table.Cell>
							<Table.Cell class="p-3 align-middle">{report.reporter.fullName}</Table.Cell>
							<Table.Cell class="p-3 align-middle"
								><StatusBadge status={report.status} /></Table.Cell
							>
							<Table.Cell
								class="hidden p-3 text-right align-middle text-muted-foreground md:table-cell"
							>
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
	</Card.Content>
</Card.Root>
