<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { formatDateTime } from '$lib/utils/date';

	type AuditLogRow = {
		id: string;
		action: string;
		entityType: string;
		entityId: string;
		createdAt: Date;
		actor: { id: string; name: string; email: string } | null;
	};

	let {
		logs = []
	}: {
		logs: AuditLogRow[];
	} = $props();
</script>

<Card.Root>
	<Card.Content class="p-0">
		<div class="overflow-x-auto">
			<Table.Root class="w-full text-sm">
				<Table.Header class="bg-muted/40 text-left">
					<Table.Row>
						<Table.Head class="px-4 py-3 font-medium">Time</Table.Head>
						<Table.Head class="px-4 py-3 font-medium">Actor</Table.Head>
						<Table.Head class="px-4 py-3 font-medium">Action</Table.Head>
						<Table.Head class="px-4 py-3 font-medium">Entity</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each logs as log (log.id)}
						<Table.Row>
							<Table.Cell class="px-4 py-3 whitespace-nowrap text-muted-foreground">
								{formatDateTime(log.createdAt)}
							</Table.Cell>
							<Table.Cell class="px-4 py-3 font-medium">
								{log.actor?.name ?? 'System'}
							</Table.Cell>
							<Table.Cell class="px-4 py-3 font-mono text-xs">
								<span class="rounded bg-muted px-1.5 py-0.5 font-semibold text-foreground">
									{log.action}
								</span>
							</Table.Cell>
							<Table.Cell class="px-4 py-3">
								<span class="text-muted-foreground">{log.entityType}</span>
								<span class="ml-1 font-mono text-xs">{log.entityId}</span>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={4} class="px-4 py-10 text-center text-muted-foreground">
								No audit logs found.
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Content>
</Card.Root>
