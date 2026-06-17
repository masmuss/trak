<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	type ReporterRow = {
		id: string;
		telegramId: string;
		username: string | null;
		fullName: string;
		inviteCodeId: string | null;
		inviteCode: { code: string } | null;
		reportCount: number;
		createdAt: Date;
		updatedAt: Date;
	};

	let {
		reporters
	}: {
		reporters: ReporterRow[];
	} = $props();
</script>

<div class="overflow-hidden rounded-lg border bg-card">
	<Table.Root>
		<Table.Header class="bg-muted/15">
			<Table.Row>
				<Table.Head class="h-11 p-3 font-medium">Full Name</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Telegram ID</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Username</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Invite Code</Table.Head>
				<Table.Head class="h-11 p-3 text-center font-medium">Tickets</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each reporters as reporter (reporter.id)}
				<Table.Row class="hover:bg-muted/50">
					<Table.Cell class="p-3 align-middle font-medium">{reporter.fullName}</Table.Cell>
					<Table.Cell class="p-3 align-middle font-mono text-muted-foreground">
						{reporter.telegramId}
					</Table.Cell>
					<Table.Cell class="p-3 align-middle text-muted-foreground">
						{reporter.username ?? '—'}
					</Table.Cell>
					<Table.Cell class="p-3 align-middle font-mono text-muted-foreground">
						{reporter.inviteCode?.code ?? '—'}
					</Table.Cell>
					<Table.Cell class="p-3 text-center align-middle">{reporter.reportCount}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
