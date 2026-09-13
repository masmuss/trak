<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let {
		filters
	}: {
		filters: {
			action: string;
			entityType: string;
			search: string;
		};
	} = $props();
</script>

<Card.Root>
	<Card.Content class="pt-6">
		<form method="GET" class="grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
			<Input name="action" placeholder="Action" value={filters.action} />
			<Input name="entityType" placeholder="Entity type" value={filters.entityType} />
			<Input name="search" placeholder="Search action or entity ID" value={filters.search} />
			<Button type="submit">Filter</Button>
		</form>
	</Card.Content>
</Card.Root>
