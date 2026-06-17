<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import SettingsProfileForm from '$lib/features/settings/components/settings-profile-form.svelte';
	import SettingsPasswordForm from '$lib/features/settings/components/settings-password-form.svelte';
	import SettingsUserCard from '$lib/features/settings/components/settings-user-card.svelte';
	import SettingsCategoriesTab from '$lib/features/settings/components/settings-categories-tab.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let currentUser = $derived(data.user);

	let tab = $state('account');
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Heading title="Settings" description="Manage your account and organization preferences." />

	<Tabs.Root bind:value={tab}>
		<Tabs.List>
			<Tabs.Trigger value="account">Account</Tabs.Trigger>
			<Tabs.Trigger value="categories">Categories</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="account">
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
		</Tabs.Content>

		<Tabs.Content value="categories">
			<SettingsCategoriesTab
				categories={data.categories}
				distribution={data.distribution}
				uncategorized={data.uncategorized}
			/>
		</Tabs.Content>
	</Tabs.Root>
</div>
