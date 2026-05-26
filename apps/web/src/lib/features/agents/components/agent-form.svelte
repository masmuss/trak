<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Agent } from '$lib/features/agents/types';

	let {
		dialogOpen = $bindable(false),
		editingAgent = $bindable<Agent | null>(null),
		onClose
	}: {
		dialogOpen: boolean;
		editingAgent: Agent | null;
		onClose: () => void;
	} = $props();

	// eslint-disable-next-line svelte/prefer-writable-derived
	let roleValue = $state<string>(editingAgent?.role ?? 'agent');
	let showSuccess = $state(false);
	let generatedPassword = $state('');

	$effect.pre(() => {
		roleValue = editingAgent?.role ?? 'agent';
	});

	const formEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				if (editingAgent) {
					toast.success('Agent updated successfully');
					await update();
					onClose();
				} else {
					generatedPassword = (result.data?.password as string) ?? '';
					showSuccess = true;
					await update();
				}
			} else if (result.type === 'error') {
				toast.error(result.error?.message ?? 'Something went wrong');
			} else if (result.type === 'failure') {
				toast.error((result.data?.error as string) ?? 'Invalid submission');
			}
		};
	};

	function done() {
		showSuccess = false;
		generatedPassword = '';
		onClose();
	}

	function copyPassword() {
		navigator.clipboard.writeText(generatedPassword);
		toast.success('Password copied');
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		{#if showSuccess}
			<Dialog.Header>
				<Dialog.Title>Agent Created</Dialog.Title>
				<Dialog.Description>
					Share the password below with the new agent. This is the only time it's shown.
				</Dialog.Description>
			</Dialog.Header>

			<Field.Set>
				<Field.Group>
					<Field.Field>
						<Field.Label for="generatedPassword">Generated Password</Field.Label>
						<div class="flex gap-2">
							<Input
								id="generatedPassword"
								type="text"
								readonly
								value={generatedPassword}
								class="font-mono"
							/>
							<Button variant="outline" onclick={copyPassword}>Copy</Button>
						</div>
					</Field.Field>

					<Button onclick={done} class="w-full">Done</Button>
				</Field.Group>
			</Field.Set>
		{:else}
			<form method="POST" action={editingAgent ? '?/update' : '?/create'} use:enhance={formEnhance}>
				<Dialog.Header>
					<Dialog.Title>
						{editingAgent ? 'Edit Agent' : 'Add Agent'}
					</Dialog.Title>
					<Dialog.Description>
						{editingAgent
							? 'Update the agent details below.'
							: 'Create a new agent account for system access.'}
					</Dialog.Description>
				</Dialog.Header>

				<Field.Set>
					<Field.Group>
						{#if editingAgent}
							<input type="hidden" name="id" value={editingAgent.id} />
						{/if}

						<Field.Field>
							<Field.Label for="name">Name</Field.Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="e.g. John Doe"
								required
								value={editingAgent?.name ?? ''}
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label for="email">Email</Field.Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="e.g. john@trak.id"
								required
								value={editingAgent?.email ?? ''}
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label for="role">Role</Field.Label>
							<Select.Root type="single" bind:value={roleValue}>
								<Select.Trigger class="w-full">
									{roleValue === 'admin' ? 'Admin' : 'Agent'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="agent">Agent</Select.Item>
									<Select.Item value="admin">Admin</Select.Item>
								</Select.Content>
							</Select.Root>
							<input type="hidden" name="role" value={roleValue} />
						</Field.Field>

						{#if editingAgent}
							<Field.Field>
								<div class="flex items-center gap-2">
									<input
										id="isActive"
										name="isActive"
										type="checkbox"
										value="true"
										checked={editingAgent.isActive}
									/>
									<Field.Label for="isActive">Active</Field.Label>
								</div>
							</Field.Field>
						{/if}

						<Field.Field>
							<Button type="submit" class="w-full">
								{editingAgent ? 'Save Changes' : 'Create Agent'}
							</Button>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
