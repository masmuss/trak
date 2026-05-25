<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let { name = '', email = '', updateProfileAction } = $props();

	const profileEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.profileSuccess) {
				toast.success('Profile updated');
				await update();
			} else if (result.type === 'failure') {
				toast.error((result.data?.profileError as string) ?? 'Failed to update profile');
			}
		};
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Profile</Card.Title>
		<Card.Description>Update your personal information and view account details.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action={updateProfileAction} use:enhance={profileEnhance}>
			<Field.Set>
				<Field.Group class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Field.Field>
						<Field.Label for="name">Full Name</Field.Label>
						<Input id="name" name="name" type="text" value={name} required />
					</Field.Field>
					<Field.Field>
						<Field.Label for="email">Email</Field.Label>
						<Input
							id="email"
							type="email"
							value={email}
							disabled
							class="cursor-not-allowed opacity-60"
						/>
					</Field.Field>
				</Field.Group>
			</Field.Set>
			<div class="mt-4 flex justify-end">
				<Button type="submit">Save Changes</Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
