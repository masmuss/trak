<script lang="ts">
	let {
		initials,
		name,
		subtitle,
		timestamp,
		avatarClass = 'bg-primary/10 text-primary'
	}: {
		initials: string;
		name: string;
		subtitle: string;
		timestamp: string;
		avatarClass?: string;
	} = $props();
</script>

<div class="mb-4 flex items-center justify-between">
	<div class="flex items-center gap-3">
		<div
			class="flex size-10 shrink-0 items-center justify-center rounded-full font-semibold {avatarClass}"
		>
			{initials}
		</div>
		<div>
			<p class="text-sm font-medium text-gray-800 dark:text-white/90">{name}</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
		</div>
	</div>
	<p class="text-xs text-gray-500 dark:text-gray-400">{timestamp}</p>
</div>
