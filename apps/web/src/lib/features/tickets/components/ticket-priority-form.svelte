<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Field from '$lib/components/ui/field';
	import * as Card from '$lib/components/ui/card';
	import type { TicketDetails } from '@trak/shared';
	import { handleFormError } from '$lib/utils/form';

	let { ticket }: { ticket: TicketDetails } = $props();

	let selectedPriority = $state('MEDIUM');

	$effect.pre(() => {
		if (ticket) {
			selectedPriority = ticket.priority;
		}
	});

	const priorityOptions = [
		{ label: 'Critical', value: 'CRITICAL' },
		{ label: 'High', value: 'HIGH' },
		{ label: 'Medium', value: 'MEDIUM' },
		{ label: 'Low', value: 'LOW' }
	];

	const formEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;

			if (result.type === 'success') {
				toast.success('Priority updated — SLA recalculated');
				await update();
			}
		};
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Priority & SLA</Card.Title>
		<Card.Description>Set priority to recalculate response/resolve deadlines.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/updatePriority" use:enhance={formEnhance}>
			<input type="hidden" name="priority" value={selectedPriority} />
			<Field.Set>
				<Field.Group>
					<Field.Field>
						<Field.Label for="priority">Priority Level</Field.Label>
						<Select.Root type="single" bind:value={selectedPriority}>
							<Select.Trigger id="priority">
								{priorityOptions.find((o) => o.value === selectedPriority)?.label ??
									'Select Priority'}
							</Select.Trigger>
							<Select.Content>
								{#each priorityOptions as option (option.value)}
									<Select.Item {...option} />
								{/each}
							</Select.Content>
						</Select.Root>
						<Field.Description>
							CRITICAL: 15min response, 2hr resolve. LOW: 24hr response, 7d resolve.
						</Field.Description>
					</Field.Field>
					<Field.Field>
						<Button type="submit" class="w-full" disabled={selectedPriority === ticket.priority}>
							Update Priority
						</Button>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</form>

		{#if ticket.slaResponseDue || ticket.slaResolveDue}
			<div class="mt-4 space-y-1.5 text-xs text-muted-foreground">
				{#if ticket.slaResponseDue}
					<div class="flex justify-between">
						<span>Response due:</span>
						<span class="font-medium">{new Date(ticket.slaResponseDue).toLocaleString()}</span>
					</div>
				{/if}
				{#if ticket.slaResolveDue}
					<div class="flex justify-between">
						<span>Resolve due:</span>
						<span class="font-medium">{new Date(ticket.slaResolveDue).toLocaleString()}</span>
					</div>
				{/if}
				{#if ticket.isSlaBreached}
					<div
						class="mt-2 rounded bg-red-50 p-2 text-center text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400"
					>
						SLA BREACHED
					</div>
				{/if}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
