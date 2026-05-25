<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let {
		changePasswordAction
	}: {
		changePasswordAction: string;
	} = $props();

	const passwordEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.passwordSuccess) {
				toast.success('Password changed successfully');
				await update();
			} else if (result.type === 'failure') {
				toast.error((result.data?.passwordError as string) ?? 'Failed to change password');
			}
		};
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Password</Card.Title>
		<Card.Description
			>Change your current password. You'll be logged out of all other sessions.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<form method="POST" action={changePasswordAction} use:enhance={passwordEnhance}>
			<Field.Set>
				<Field.Group class="space-y-4">
					<Field.Field>
						<Field.Label for="currentPassword">Current Password</Field.Label>
						<Input id="currentPassword" name="currentPassword" type="password" required />
					</Field.Field>
					<Field.Field>
						<Field.Label for="newPassword">New Password</Field.Label>
						<Input id="newPassword" name="newPassword" type="password" required />
					</Field.Field>
					<Field.Field>
						<Field.Label for="confirmPassword">Confirm New Password</Field.Label>
						<Input id="confirmPassword" name="confirmPassword" type="password" required />
					</Field.Field>
				</Field.Group>
			</Field.Set>
			<div class="mt-4 flex justify-end">
				<Button type="submit">Change Password</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
