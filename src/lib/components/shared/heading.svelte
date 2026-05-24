<script lang="ts">
	import { cn } from '$lib/utils';

	const {
		title,
		description,
		class: cls,
		variant
	} = $props<{
		title: string;
		description?: string;
		class?: string;
		variant?: 'small' | 'default';
	}>();
</script>

<header class={cn(variant === 'small' ? '' : 'mb-4 space-y-0.5', cls)}>
	<h2
		class={variant === 'small'
			? 'mb-0.5 text-base font-medium'
			: 'text-xl font-semibold tracking-tight'}
	>
		{title}
	</h2>
	{#if description}
		<p class="text-sm text-muted-foreground">{description}</p>
	{/if}
</header>
