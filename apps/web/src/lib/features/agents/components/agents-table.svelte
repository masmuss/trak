<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { User as Agent } from '@trak/shared';
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

<div class="overflow-hidden rounded-lg border bg-card">
	<Table.Root>
		<Table.Header class="bg-muted/15">
			<Table.Row>
				<Table.Head class="h-11 p-3 font-medium">Name</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Email</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Role</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Status</Table.Head>
				<Table.Head class="h-11 p-3 font-medium">Created</Table.Head>
				<Table.Head class="h-11 w-25 p-3 font-medium">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each agents as agent (agent.id)}
				<Table.Row class="hover:bg-muted/50">
					<Table.Cell class="p-3 align-middle font-medium">{agent.name}</Table.Cell>
					<Table.Cell class="p-3 align-middle text-muted-foreground">{agent.email}</Table.Cell>
					<Table.Cell class="p-3 align-middle">
						<Badge variant={isAdmin(agent) ? 'default' : 'secondary'}>
							{agent.role}
						</Badge>
					</Table.Cell>
					<Table.Cell class="p-3 align-middle">
						{#if agent.isActive}
							<Badge>Active</Badge>
						{:else}
							<Badge variant="destructive">Inactive</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell class="p-3 align-middle text-sm text-muted-foreground">
						{formatDate(agent.createdAt)}
					</Table.Cell>
					<Table.Cell class="p-3 align-middle">
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
</div>

<DeleteConfirmDialog
	bind:open={dialogOpen}
	title={`Delete agent "${deleteTarget?.name}"?`}
	description="This action cannot be undone. The agent will be permanently removed."
	action={deleteTarget?.action ?? ''}
	id={deleteTarget?.id ?? ''}
	successMessage="Agent deleted successfully"
/>
