<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { StarIcon } from 'phosphor-svelte';
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title>Reporter Satisfaction</Card.Title>
			<span class="text-xs font-medium text-primary">4.8 / 5.0</span>
		</div>
		<Card.Description>Based on last 50 reviews</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center gap-1">
			{#each [1, 2, 3, 4, 5] as star (star)}
				<StarIcon class="size-5 {star <= 4 ? 'text-primary' : 'text-primary/30'}" />
			{/each}
			<span class="ml-2 text-xs text-muted-foreground">(Last 50 reviews)</span>
		</div>
	</Card.Content>
</Card.Root>
