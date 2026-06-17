<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { handleFormError } from '$lib/utils/form';
	import type { TicketDetails } from '@trak/shared';

	let { ticket }: { ticket: TicketDetails } = $props();

	let selectedStatus = $derived(ticket.status);
	let noteText = $state('');

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
				toast.success('Status updated');
				await update();
			}
		};
	};
</script>

<form method="POST" action="?/updateStatus" use:enhance={statusEnhance} class="w-full">
	<input type="hidden" name="status" value={selectedStatus} />
	<Textarea
		name="note"
		placeholder="Add a note about this status change..."
		bind:value={noteText}
		class="min-h-24"
	/>
	<div class="mt-3 flex items-center justify-between gap-3">
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
		<Button type="submit" disabled={selectedStatus === ticket.status}>Update Status</Button>
	</div>
</form>
