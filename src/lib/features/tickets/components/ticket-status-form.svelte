<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Field from '$lib/components/ui/field';
	import type { TicketDetails } from '../types.js';
	import * as Card from '$lib/components/ui/card';

	let { ticket }: { ticket: TicketDetails } = $props();

	let selectedStatus = $state('open');
	let noteText = $state('');

	$effect.pre(() => {
		if (ticket) {
			selectedStatus = ticket.status;
		}
	});

	const statusOptions = [
		{ label: 'Open', value: 'open' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Resolved', value: 'resolved' },
		{ label: 'Closed', value: 'closed' }
	];

	const formEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				noteText = '';
				toast.success('Status transition applied');
				await update();
			} else if (result.type === 'error') {
				toast.error(result.error?.message ?? 'Something went wrong');
			} else if (result.type === 'failure') {
				toast.error((result.data?.error as string) ?? 'Invalid submission');
			}
		};
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Transition Status</Card.Title>
		<Card.Description>Update state and document actions.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/updateStatus" use:enhance={formEnhance}>
			<input type="hidden" name="status" value={selectedStatus} />
			<Field.Set>
				<Field.Group>
					<Field.Field>
						<Field.Label for="status">Select New Status</Field.Label>
						<Select.Root type="single" bind:value={selectedStatus}>
							<Select.Trigger id="status">
								{statusOptions.find((o) => o.value === selectedStatus)?.label ?? 'Select Status'}
							</Select.Trigger>
							<Select.Content>
								{#each statusOptions as option (option.value)}
									<Select.Item {...option} />
								{/each}
							</Select.Content>
						</Select.Root>
						<Field.Description>Select the new status for the ticket.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Label for="note">Status Note (Optional)</Field.Label>
						<Textarea
							id="note"
							name="note"
							placeholder="Add details about why status changed..."
							bind:value={noteText}
							class="min-h-24 text-sm"
						/>
						<Field.Description>Add details about why status changed.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Button type="submit" class="w-full" disabled={selectedStatus === ticket.status}>
							Apply Transition
						</Button>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</form>
	</Card.Content>
</Card.Root>
