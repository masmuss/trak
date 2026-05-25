<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as Avatar from '$lib/components/ui/avatar';

	let {
		name,
		email = '',
		role = 'agent',
		createdAt
	}: {
		name: string;
		email?: string | null;
		role?: string | null;
		createdAt?: string | Date | null;
	} = $props();

	function initials(n: string): string {
		return n
			.split(' ')
			.map((part) => part[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<Card.Root>
	<Card.Content class="flex flex-col items-center gap-3 pt-6 text-center">
		<Avatar.Root class="size-16">
			<Avatar.Fallback class="bg-primary/10 text-lg font-semibold text-primary">
				{initials(name)}
			</Avatar.Fallback>
		</Avatar.Root>
		<div>
			<p class="text-sm font-semibold">{name}</p>
			<p class="text-xs text-muted-foreground">{email}</p>
		</div>
		<Badge variant={role === 'admin' ? 'default' : 'secondary'} class="capitalize">
			{role}
		</Badge>
		<p class="text-xs text-muted-foreground">
			Member since {createdAt
				? new Date(createdAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long'
					})
				: 'Unknown'}
		</p>
	</Card.Content>
</Card.Root>
