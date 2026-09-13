<script lang="ts">
	import type { TicketDetails } from '@trak/shared';
	import { TelegramLogoIcon } from 'phosphor-svelte';

	let { reporter }: { reporter: TicketDetails['reporter'] } = $props();
</script>

<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Customer</span>
	<span class="text-right text-sm text-foreground">
		{reporter.fullName}
	</span>
</li>
<li class="grid grid-cols-2 gap-4 px-6 py-2.5">
	<span class="text-sm text-muted-foreground">Telegram</span>
	{#if reporter.username}
		<a
			href="https://t.me/{reporter.username}"
			target="_blank"
			rel="external noopener noreferrer"
			class="inline-flex items-center justify-end gap-1 text-right text-sm text-primary hover:underline"
		>
			<TelegramLogoIcon class="size-3" />
			@{reporter.username}
		</a>
	{:else}
		<span class="text-right text-sm text-muted-foreground">-</span>
	{/if}
</li>
