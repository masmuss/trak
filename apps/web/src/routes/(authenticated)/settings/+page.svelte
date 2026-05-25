<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import SettingsProfileForm from '$lib/features/settings/components/settings-profile-form.svelte';
	import SettingsPasswordForm from '$lib/features/settings/components/settings-password-form.svelte';
	import SettingsUserCard from '$lib/features/settings/components/settings-user-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let currentUser = $derived(data.user);
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<Heading title="Settings" description="Manage your account profile and security preferences." />

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
		<div class="space-y-4 xl:col-span-2">
			<SettingsProfileForm
				name={currentUser.name}
				email={currentUser.email}
				updateProfileAction="?/updateProfile"
			/>
			<SettingsPasswordForm changePasswordAction="?/changePassword" />
		</div>

		<div class="space-y-4">
			<SettingsUserCard
				name={currentUser.name}
				email={currentUser.email}
				role={currentUser.role}
				createdAt={currentUser.createdAt}
			/>
		</div>
	</div>
</div>
