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

<Table.Root class="border">
	<Table.Header>
		<Table.Row>
			<Table.Head>Full Name</Table.Head>
			<Table.Head>Telegram ID</Table.Head>
			<Table.Head>Username</Table.Head>
			<Table.Head>Invite Code</Table.Head>
			<Table.Head class="text-center">Tickets</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each reporters as reporter (reporter.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{reporter.fullName}</Table.Cell>
				<Table.Cell class="font-mono text-muted-foreground">
					{reporter.telegramId}
				</Table.Cell>
				<Table.Cell class="text-muted-foreground">
					{reporter.username ?? '—'}
				</Table.Cell>
				<Table.Cell class="font-mono text-muted-foreground">
					{reporter.inviteCode?.code ?? '—'}
				</Table.Cell>
				<Table.Cell class="text-center">{reporter.reportCount}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
