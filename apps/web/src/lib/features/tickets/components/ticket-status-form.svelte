<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { handleFormError } from '$lib/utils/form';
	import type { TicketDetails } from '@trak/shared';

	let { ticket }: { ticket: TicketDetails } = $props();

	let selectedStatus = $derived(ticket.status);
	let noteText = $state('');
	let noteDialogOpen = $state(false);

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];

	const statusEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;
			if (result.type === 'success') {
				noteText = '';
				noteDialogOpen = false;
				toast.success('Status updated');
				await update();
			}
		};
	};
</script>

<form method="POST" action="?/updateStatus" use:enhance={statusEnhance} class="w-full">
	<input type="hidden" name="status" value={selectedStatus} />
	<input type="hidden" name="note" value={noteText} />
	<div class="flex items-center justify-between gap-3">
		<Select.Root type="single" bind:value={selectedStatus}>
			<Select.Trigger class="w-44">
				{statusOptions.find((o) => o.value === selectedStatus)?.label ?? 'Select Status'}
			</Select.Trigger>
			<Select.Content>
				{#each statusOptions as option (option.value)}
					<Select.Item {...option} />
				{/each}
			</Select.Content>
		</Select.Root>
		<div class="flex items-center gap-2">
			<Dialog.Root bind:open={noteDialogOpen}>
				<Dialog.Trigger class="text-sm text-muted-foreground hover:text-foreground">
					{noteText ? 'Edit note' : 'Add note'}
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Status change note</Dialog.Title>
						<Dialog.Description>
							Add context for the team about this status update. This is optional.
						</Dialog.Description>
					</Dialog.Header>
					<Textarea
						placeholder="Explain why the status changed..."
						bind:value={noteText}
						class="min-h-24"
						maxlength={5000}
					/>
					<Dialog.Footer>
						<Dialog.Close>
							{#snippet child({ props })}
								<Button variant="outline" {...props}>Done</Button>
							{/snippet}
						</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<Button type="submit" disabled={selectedStatus === ticket.status}>Update Status</Button>
		</div>
	</div>
</form>
