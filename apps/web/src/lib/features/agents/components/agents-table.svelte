<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Agent } from '$lib/features/agents/types';
	import { Badge } from '$lib/components/ui/badge';
	import { PencilIcon, TrashIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import DeleteConfirmDialog from '$lib/components/shared/delete-confirm-dialog.svelte';

	let {
		agents,
		onEdit
	}: {
		agents: Agent[];
		onEdit: (agent: Agent) => void;
	} = $props();

	let dialogOpen = $state(false);
	let deleteTarget = $state<{ id: string; name: string; action: string } | null>(null);

	function formatDate(date: Date | null | undefined): string {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('en-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function isAdmin(agent: Agent): boolean {
		return agent.role === 'admin';
	}
</script>

<Table.Root class="border">
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Email</Table.Head>
			<Table.Head>Role</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head class="w-25">Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each agents as agent (agent.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{agent.name}</Table.Cell>
				<Table.Cell class="text-muted-foreground">{agent.email}</Table.Cell>
				<Table.Cell>
					<Badge variant={isAdmin(agent) ? 'default' : 'secondary'}>
						{agent.role}
					</Badge>
				</Table.Cell>
				<Table.Cell>
					{#if agent.isActive}
						<Badge>Active</Badge>
					{:else}
						<Badge variant="destructive">Inactive</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="text-sm text-muted-foreground">
					{formatDate(agent.createdAt)}
				</Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-1">
						<Button variant="ghost" size="icon-sm" onclick={() => onEdit(agent)}>
							<PencilIcon />
							<span class="sr-only">Edit</span>
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onclick={() => {
								deleteTarget = { id: agent.id, name: agent.name, action: '?/delete' };
								dialogOpen = true;
							}}
						>
							<TrashIcon />
							<span class="sr-only">Delete</span>
						</Button>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<DeleteConfirmDialog
	bind:open={dialogOpen}
	title={`Delete agent "${deleteTarget?.name}"?`}
	description="This action cannot be undone. The agent will be permanently removed."
	action={deleteTarget?.action ?? ''}
	id={deleteTarget?.id ?? ''}
	successMessage="Agent deleted successfully"
/>
