<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	let {
		assignee,
		agents = [],
		currentUser
	}: {
		assignee?: TicketDetails['assignee'];
		agents?: { id: string; name: string }[];
		currentUser?: { id: string; role?: string | null };
	} = $props();

	let selectedAssignee = $derived('');

	$effect(() => {
		selectedAssignee = assignee?.id ?? '';
	});
</script>

<li class="space-y-2 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Assigned To</span>
	<p class="text-sm text-foreground">{assignee?.name ?? 'Unassigned'}</p>

	{#if !assignee}
		<form method="POST" action="?/claim">
			<Button type="submit" size="sm" variant="outline">Claim ticket</Button>
		</form>
	{/if}

	{#if currentUser?.role === 'admin'}
		<form method="POST" action="?/assign" class="flex gap-2">
			<input type="hidden" name="assigneeId" value={selectedAssignee} />
			<Select.Root type="single" bind:value={selectedAssignee}>
				<Select.Trigger class="min-w-0 flex-1">
					{agents.find((agent) => agent.id === selectedAssignee)?.name ?? 'Unassigned'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="" label="Unassigned" />
					{#each agents as agent (agent.id)}
						<Select.Item value={agent.id} label={agent.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<Button type="submit">Save</Button>
		</form>
	{/if}
</li>
