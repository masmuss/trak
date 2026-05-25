<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { BarChart } from 'layerchart';
	import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart';

	type DayData = { day: string; minutes: number };

	const chartConfig = {
		minutes: { label: 'Response Time (min)', color: 'hsl(var(--primary))' }
	} as const;

	const data: DayData[] = [
		{ day: 'Mon', minutes: 40 },
		{ day: 'Tue', minutes: 60 },
		{ day: 'Wed', minutes: 50 },
		{ day: 'Thu', minutes: 80 },
		{ day: 'Fri', minutes: 70 },
		{ day: 'Sat', minutes: 90 },
		{ day: 'Sun', minutes: 30 }
	];
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title>Response Time Trend</Card.Title>
			<span class="text-xs font-medium text-emerald-600">-15m Avg.</span>
		</div>
		<Card.Description>Average response time over last 7 days</Card.Description>
	</Card.Header>
	<Card.Content>
		<ChartContainer config={chartConfig} class="aspect-auto h-30 w-full">
			<BarChart {data} x="day" y="minutes" />
			<ChartTooltip />
		</ChartContainer>
	</Card.Content>
</Card.Root>
