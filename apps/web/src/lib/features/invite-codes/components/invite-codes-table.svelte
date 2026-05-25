<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { InviteCode } from '$lib/features/invite-codes/types';
	import { Badge } from '$lib/components/ui/badge';
	import { PencilIcon, TrashIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let {
		inviteCodes,
		onEdit
	}: {
		inviteCodes: InviteCode[];
		onEdit: (inviteCode: InviteCode) => void;
	} = $props();

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

	const deleteEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success('Invite code deleted successfully');
				await update();
			} else if (result.type === 'error') {
				toast.error(result.error?.message ?? 'Something went wrong');
			} else if (result.type === 'failure') {
				toast.error((result.data?.error as string) ?? 'Invalid submission');
			}
		};
	};
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
						<form
							method="POST"
							action="?/delete"
							use:enhance={deleteEnhance}
							onsubmit={(e) => {
								if (!confirm(`Are you sure you want to delete code "${code.code}"?`)) {
									e.preventDefault();
								}
							}}
						>
							<input type="hidden" name="id" value={code.id} />
							<Button variant="ghost" size="icon-sm" type="submit">
								<TrashIcon />
								<span class="sr-only">Delete</span>
							</Button>
						</form>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
