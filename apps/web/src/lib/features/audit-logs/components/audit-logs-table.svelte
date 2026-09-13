<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { formatDateTime } from '$lib/utils/date';

	type AuditLogRow = {
		id: string;
		action: string;
		entityType: string;
		entityId: string;
		beforeData: unknown;
		afterData: unknown;
		createdAt: Date;
		actor: { id: string; name: string; email: string } | null;
	};

	let {
		logs = []
	}: {
		logs: AuditLogRow[];
	} = $props();

	let selectedLog = $state<AuditLogRow | null>(null);

	function formatData(data: unknown): string {
		if (data === null || data === undefined) return '—';
		return JSON.stringify(data, null, 2);
	}
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
						<Table.Head class="px-4 py-3 font-medium">Detail</Table.Head>
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
							<Table.Cell class="px-4 py-3">
								<Button variant="ghost" size="sm" onclick={() => (selectedLog = log)}>View</Button>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="px-4 py-10 text-center text-muted-foreground">
								No audit logs found.
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Content>
</Card.Root>

<Dialog.Root open={selectedLog !== null} onOpenChange={(open) => !open && (selectedLog = null)}>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Audit detail</Dialog.Title>
			<Dialog.Description>
				{selectedLog?.action} · {selectedLog?.entityType} ·
				<span class="font-mono">{selectedLog?.entityId}</span>
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<h4 class="mb-1 text-sm font-medium">Before</h4>
				<pre class="max-h-80 overflow-auto rounded-md bg-muted p-3 font-mono text-xs">{formatData(
						selectedLog?.beforeData
					)}</pre>
			</div>
			<div>
				<h4 class="mb-1 text-sm font-medium">After</h4>
				<pre class="max-h-80 overflow-auto rounded-md bg-muted p-3 font-mono text-xs">{formatData(
						selectedLog?.afterData
					)}</pre>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
