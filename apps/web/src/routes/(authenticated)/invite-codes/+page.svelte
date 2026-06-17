<script lang="ts">
	import * as Card from '$lib/components/ui/card';
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

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between border-b px-6 py-5">
			<div>
				<Card.Title class="text-xl leading-none">Invite Codes</Card.Title>
				<Card.Description class="mt-2"
					>Manage invite codes for Telegram reporter registration.</Card.Description
				>
			</div>
			<Card.Action>
				<Button onclick={openCreate} size="sm">
					<PlusIcon />
					Add Invite Code
				</Button>
			</Card.Action>
		</Card.Header>
		<Card.Content class="p-6">
			<InviteCodesTable inviteCodes={data.inviteCodes} onEdit={openEdit} />
		</Card.Content>
	</Card.Root>
</div>

<InviteCodeForm bind:dialogOpen bind:editingInviteCode onClose={closeDialog} />
