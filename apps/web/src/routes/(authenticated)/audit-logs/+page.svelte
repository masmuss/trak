<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Audit Logs</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold">Audit Logs</h1>
		<p class="text-sm text-muted-foreground">Review administrative and ticket activity.</p>
	</div>

	<Card.Root>
		<Card.Content class="pt-6">
			<form method="GET" class="grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
				<Input name="action" placeholder="Action" value={data.filters.action} />
				<Input name="entityType" placeholder="Entity type" value={data.filters.entityType} />
				<Input name="search" placeholder="Search action or entity ID" value={data.filters.search} />
				<Button type="submit">Filter</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content class="p-0">
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="border-b bg-muted/40 text-left">
						<tr>
							<th class="px-4 py-3 font-medium">Time</th>
							<th class="px-4 py-3 font-medium">Actor</th>
							<th class="px-4 py-3 font-medium">Action</th>
							<th class="px-4 py-3 font-medium">Entity</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each data.logs as log (log.id)}
							<tr>
								<td class="px-4 py-3 whitespace-nowrap text-muted-foreground">
									{new Date(log.createdAt).toLocaleString()}
								</td>
								<td class="px-4 py-3">{log.actor?.name ?? 'System'}</td>
								<td class="px-4 py-3 font-mono text-xs">{log.action}</td>
								<td class="px-4 py-3">
									<span class="text-muted-foreground">{log.entityType}</span>
									<span class="font-mono text-xs">{log.entityId}</span>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-4 py-10 text-center text-muted-foreground">
									No audit logs found.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card.Content>
	</Card.Root>
</div>
