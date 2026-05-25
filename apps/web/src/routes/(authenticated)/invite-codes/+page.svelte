<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import type { InviteCode } from '@trak/shared';
	import InviteCodesTable from '$lib/features/invite-codes/components/invite-codes-table.svelte';
	import InviteCodeForm from '$lib/features/invite-codes/components/invite-code-form.svelte';

	let { data }: { data: PageData } = $props();

	let editingInviteCode: InviteCode | null = $state(null);
	let dialogOpen = $state(false);

	function openCreate() {
		editingInviteCode = null;
		dialogOpen = true;
	}

	function openEdit(code: InviteCode) {
		editingInviteCode = code;
		dialogOpen = true;
	}

	function closeDialog() {
		dialogOpen = false;
		editingInviteCode = null;
	}
</script>

<svelte:head>
	<title>Invite Codes</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading
			title="Invite Codes"
			description="Manage invite codes for Telegram reporter registration."
		/>
		<Button onclick={openCreate}>
			<PlusIcon />
			Add Invite Code
		</Button>
	</div>

	<InviteCodesTable inviteCodes={data.inviteCodes} onEdit={openEdit} />
</div>

<InviteCodeForm bind:dialogOpen bind:editingInviteCode onClose={closeDialog} />
