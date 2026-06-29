<script lang="ts">
	import LoginForm from '$lib/features/auth/login-form.svelte';
	import { GlobeIcon } from 'phosphor-svelte';
	import type { ActionData } from './$types';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import AppIcon from '$lib/components/shared/app-icon.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login - Trak</title>
</svelte:head>

<main>
	<div class="grid h-dvh justify-center p-2 lg:grid-cols-2">
		<div class="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
			<div class="absolute top-10 space-y-1 px-10 text-primary-foreground">
				<AppIcon />
				<h1 class="text-2xl font-medium">Trak</h1>
				<p class="text-sm">Ticket Tracker for Customer Support.</p>
			</div>

			<div class="absolute bottom-10 flex w-full justify-between px-10">
				<div class="flex-1 space-y-1 text-primary-foreground">
					<h2 class="font-medium">Easy ticketing</h2>
					<p class="text-sm">Seamless support workflows integrated directly with Telegram bot.</p>
				</div>
				<Separator orientation="vertical" class="mx-3 !h-auto bg-primary-foreground/30" />
				<div class="flex-1 space-y-1 text-primary-foreground">
					<h2 class="font-medium">Need help?</h2>
					<p class="text-sm">Contact the admin if you don't have an agent account yet.</p>
				</div>
			</div>
		</div>
		<div class="relative order-1 flex h-full">
			<div class="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
				<div class="space-y-2 text-center">
					<h1 class="text-3xl font-medium">Login to your account</h1>
					<p class="text-sm text-muted-foreground">Please enter your credentials to login.</p>
				</div>
				<div class="space-y-4">
					<LoginForm {form} />
				</div>
			</div>

			<div class="absolute bottom-5 flex w-full justify-between px-10">
				<div class="text-sm text-muted-foreground">&copy; 2026 Trak.</div>
				<div class="flex items-center gap-1 text-sm text-muted-foreground">
					<GlobeIcon class="size-4" />
					ENG
				</div>
			</div>
		</div>
	</div>
</main>
