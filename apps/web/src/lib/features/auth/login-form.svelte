<script lang="ts">
	import { FieldGroup, Field, FieldLabel } from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../routes/login/$types';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { WarningCircleIcon } from 'phosphor-svelte';

	let {
		form,
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLFormAttributes> & {
		form?: ActionData;
	} = $props();
	const id = $props.id();
</script>

<form
	method="POST"
	action="?/signInEmail"
	use:enhance
	class={cn('flex flex-col gap-6', className)}
	bind:this={ref}
	{...restProps}
>
	<FieldGroup>
		<div class="flex flex-col items-center gap-1 text-center">
			<h1 class="text-2xl font-bold">Login to your account</h1>
			<p class="text-sm text-balance text-muted-foreground">
				Enter your email below to login to your account
			</p>
		</div>
		{#if form?.message}
			<Alert variant="destructive">
				<WarningCircleIcon />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{form?.message}</AlertDescription>
			</Alert>
		{/if}
		<Field>
			<FieldLabel for="email-{id}">Email</FieldLabel>
			<Input id="email-{id}" name="email" type="email" placeholder="m@example.com" required />
		</Field>
		<Field>
			<div class="flex items-center">
				<FieldLabel for="password-{id}">Password</FieldLabel>
				<a href="##" class="ms-auto text-sm underline-offset-4 hover:underline">
					Forgot your password?
				</a>
			</div>
			<Input id="password-{id}" name="password" type="password" required />
		</Field>
		<Field>
			<Button type="submit">Login</Button>
		</Field>
	</FieldGroup>
</form>
