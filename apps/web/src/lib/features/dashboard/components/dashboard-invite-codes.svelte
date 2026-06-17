<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircleIcon, CopySimpleIcon, LockKeyIcon } from 'phosphor-svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	type InviteCodeRow = {
		id: string;
		code: string;
		isActive: boolean;
		expiresAt: Date | null;
		reporterCount: number;
	};

	let { inviteCodes = [] }: { inviteCodes?: InviteCodeRow[] } = $props();

	function isExpired(expiresAt: Date | null): boolean {
		if (!expiresAt) return false;
		return new Date(expiresAt) < new Date();
	}

	function statusLabel(code: InviteCodeRow): string {
		if (!code.isActive) return 'Inactive';
		if (isExpired(code.expiresAt)) return 'Expired';
		return `Active • ${code.reporterCount} used`;
	}

	function isActive(code: InviteCodeRow): boolean {
		return code.isActive && !isExpired(code.expiresAt);
	}

	function copyCode(code: string) {
		navigator.clipboard.writeText(code);
		toast.success('Invite code copied');
	}
</script>

<Card.Root class="flex h-full flex-col">
	<Card.Header>
		<Card.Title class="leading-none">Invite Codes</Card.Title>
		<Card.Description>Manage organizational access</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1">
		<ScrollArea class="h-70 pr-4">
			<div class="space-y-3">
				{#each inviteCodes as code (code.id)}
					<div
						class="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
						class:opacity-60={!isActive(code)}
					>
						<div>
							<p class="font-mono text-sm font-bold">{code.code}</p>
							<div class="mt-1 flex items-center gap-2">
								<span
									class="h-2 w-2 rounded-full"
									class:bg-emerald-500={isActive(code)}
									class:bg-muted-foreground={!isActive(code)}
								></span>
								<span class="text-xs text-muted-foreground">{statusLabel(code)}</span>
							</div>
						</div>
						{#if isActive(code)}
							<Button
								variant="ghost"
								size="icon-sm"
								class="opacity-0 transition-opacity group-hover:opacity-100"
								onclick={() => copyCode(code.code)}
							>
								<CopySimpleIcon />
								<span class="sr-only">Copy</span>
							</Button>
						{:else}
							<LockKeyIcon class="text-muted-foreground" />
						{/if}
					</div>
				{/each}
			</div>
		</ScrollArea>
	</Card.Content>
	<Card.Footer>
		<Button
			variant="outline"
			class="w-full border-dashed"
			onclick={() => goto(resolve('/(authenticated)/invite-codes'))}
		>
			<PlusCircleIcon />
			Generate New Code
		</Button>
	</Card.Footer>
</Card.Root>
