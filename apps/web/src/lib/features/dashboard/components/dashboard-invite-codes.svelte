<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { CopySimpleIcon, PlusCircleIcon, LockKeyIcon } from 'phosphor-svelte';

	type InviteCodeRow = {
		code: string;
		description: string;
		status: 'active' | 'expired';
	};

	const defaultInviteCodes: InviteCodeRow[] = [
		{ code: 'XMAS-2023-PRO', description: 'Active • 12/20 Used', status: 'active' },
		{ code: 'BETA-USER-99', description: 'Active • 4/5 Used', status: 'active' },
		{ code: 'OLD-REPORTER-12', description: 'Expired Oct 01', status: 'expired' }
	];

	let { inviteCodes = defaultInviteCodes }: { inviteCodes?: InviteCodeRow[] } = $props();
</script>

<Card.Root class="flex h-full flex-col">
	<Card.Header>
		<Card.Title>Invite Codes</Card.Title>
		<Card.Description>Manage organizational access</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1 space-y-3">
		{#each inviteCodes as code (code.code)}
			<div
				class="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
				class:opacity-60={code.status === 'expired'}
			>
				<div>
					<p class="font-mono text-sm font-bold">{code.code}</p>
					<div class="mt-1 flex items-center gap-2">
						<span
							class="h-2 w-2 rounded-full"
							class:bg-emerald-500={code.status === 'active'}
							class:bg-muted-foreground={code.status === 'expired'}
						></span>
						<span class="text-xs text-muted-foreground">{code.description}</span>
					</div>
				</div>
				{#if code.status === 'active'}
					<Button
						variant="ghost"
						size="icon-sm"
						class="opacity-0 transition-opacity group-hover:opacity-100"
					>
						<CopySimpleIcon />
						<span class="sr-only">Copy</span>
					</Button>
				{:else}
					<LockKeyIcon class="text-muted-foreground" />
				{/if}
			</div>
		{/each}
	</Card.Content>
	<Card.Footer class="border-t">
		<Button variant="outline" class="w-full border-dashed">
			<PlusCircleIcon />
			Generate New Code
		</Button>
	</Card.Footer>
</Card.Root>
