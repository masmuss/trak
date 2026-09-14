<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { BarChart } from 'layerchart';
	import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart';
	import type { VolumeDayData } from '@trak/services';

	let { volume }: { volume: VolumeDayData[] } = $props();

	const chartConfig = {
		created: { label: 'Created', color: 'var(--primary)' },
		resolved: { label: 'Resolved', color: 'var(--chart-2)' }
	} as const;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="leading-none">Ticket Volume</Card.Title>
		<Card.Description>Created vs resolved tickets per day, last 14 days</Card.Description>
	</Card.Header>
	<Card.Content>
		<ChartContainer config={chartConfig} class="h-72 w-full">
			<BarChart
				data={volume}
				x="day"
				seriesLayout="group"
				series={[
					{ key: 'created', label: 'Created', color: 'var(--primary)' },
					{ key: 'resolved', label: 'Resolved', color: 'var(--chart-2)' }
				]}
			/>
			<ChartTooltip />
		</ChartContainer>
	</Card.Content>
</Card.Root>
