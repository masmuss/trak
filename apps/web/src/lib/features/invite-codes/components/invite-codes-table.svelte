<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { InviteCode } from '@trak/shared';
	import { Badge } from '$lib/components/ui/badge';
	import { PencilIcon, TrashIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import DeleteConfirmDialog from '$lib/components/shared/delete-confirm-dialog.svelte';

	let {
		inviteCodes,
		onEdit
	}: {
		inviteCodes: InviteCode[];
		onEdit: (inviteCode: InviteCode) => void;
	} = $props();

	let dialogOpen = $state(false);
	let deleteTarget = $state<{ id: string; code: string; action: string } | null>(null);

	function formatDate(date: Date | null | undefined): string {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('en-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function isExpired(code: InviteCode): boolean {
		if (!code.expiresAt) return false;
		return new Date(code.expiresAt) < new Date();
	}
</script>

<Table.Root class="border">
	<Table.Header>
		<Table.Row>
			<Table.Head>Code</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head>Expires</Table.Head>
			<Table.Head>Created</Table.Head>
			<Table.Head class="w-25">Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each inviteCodes as code (code.id)}
			<Table.Row>
				<Table.Cell class="font-mono font-medium">{code.code}</Table.Cell>
				<Table.Cell>
					{#if isExpired(code)}
						<Badge variant="destructive">Expired</Badge>
					{:else if code.isActive}
						<Badge>Active</Badge>
					{:else}
						<Badge variant="secondary">Inactive</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="text-sm text-muted-foreground">
					{formatDate(code.expiresAt)}
				</Table.Cell>
				<Table.Cell class="text-sm text-muted-foreground">
					{formatDate(code.createdAt)}
				</Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-1">
						<Button variant="ghost" size="icon-sm" onclick={() => onEdit(code)}>
							<PencilIcon />
							<span class="sr-only">Edit</span>
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onclick={() => {
								deleteTarget = { id: code.id, code: code.code, action: '?/delete' };
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
	title={`Delete code "${deleteTarget?.code}"?`}
	description="This action cannot be undone. The invite code will be permanently deleted."
	action={deleteTarget?.action ?? ''}
	id={deleteTarget?.id ?? ''}
	successMessage="Invite code deleted successfully"
/>
