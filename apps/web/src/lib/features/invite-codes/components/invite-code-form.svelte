<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { InviteCode } from '@trak/shared';
	import { handleFormError } from '$lib/utils/form';

	let {
		dialogOpen = $bindable(false),
		editingInviteCode = $bindable<InviteCode | null>(null),
		onClose
	}: {
		dialogOpen: boolean;
		editingInviteCode: InviteCode | null;
		onClose: () => void;
	} = $props();

	function toDatetimeLocal(date: Date | null | undefined): string {
		if (!date) return '';
		const d = new Date(date);
		const offset = d.getTimezoneOffset();
		const local = new Date(d.getTime() - offset * 60_000);
		return local.toISOString().slice(0, 16);
	}

	const formEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;

			if (result.type === 'success') {
				const label = editingInviteCode ? 'updated' : 'created';
				toast.success(`Invite code ${label} successfully`);
				await update();
				onClose();
			}
		};
	};
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<form
			method="POST"
			action={editingInviteCode ? '?/update' : '?/create'}
			use:enhance={formEnhance}
		>
			<Dialog.Header>
				<Dialog.Title>
					{editingInviteCode ? 'Edit Invite Code' : 'Add Invite Code'}
				</Dialog.Title>
				<Dialog.Description>
					{editingInviteCode
						? 'Update the invite code details below.'
						: 'Generate a new invite code for reporters.'}
				</Dialog.Description>
			</Dialog.Header>

			<Field.Set>
				<Field.Group>
					{#if editingInviteCode}
						<input type="hidden" name="id" value={editingInviteCode.id} />
					{/if}

					<Field.Field>
						<Field.Label for="code">Code</Field.Label>
						<Input
							id="code"
							name="code"
							type="text"
							placeholder="e.g. WELCOME2024"
							required
							value={editingInviteCode?.code ?? ''}
						/>
						<Field.Description>The invite code reporters must enter to register.</Field.Description>
					</Field.Field>

					<Field.Field>
						<Field.Label for="expiresAt">Expires At</Field.Label>
						<Input
							id="expiresAt"
							name="expiresAt"
							type="datetime-local"
							value={toDatetimeLocal(editingInviteCode?.expiresAt)}
						/>
						<Field.Description>Leave empty for no expiry.</Field.Description>
					</Field.Field>

					{#if editingInviteCode}
						<Field.Field>
							<div class="flex items-center gap-2">
								<input
									id="isActive"
									name="isActive"
									type="checkbox"
									value="true"
									checked={editingInviteCode.isActive}
								/>
								<Field.Label for="isActive">Active</Field.Label>
							</div>
							<Field.Description>Disable to prevent this code from being used.</Field.Description>
						</Field.Field>
					{/if}

					<Field.Field>
						<Button type="submit" class="w-full">
							{editingInviteCode ? 'Save Changes' : 'Create Invite Code'}
						</Button>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</form>
	</Dialog.Content>
</Dialog.Root>
