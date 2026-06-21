<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { BarChart } from 'layerchart';
	import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart';
	import type { PerformanceOverviewData } from '@trak/services';

	let { overview }: { overview: PerformanceOverviewData } = $props();

	const chartConfig = {
		minutes: { label: 'Response Time (min)', color: 'hsl(var(--primary))' }
	} as const;

	const data = $derived(overview.chartData);

	// Use real data
	const totalReports = $derived(overview.totalReports);
	const resolvedReports = $derived(overview.resolvedReports);
	const resolveRate = $derived(
		totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0
	);
</script>

<div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
	<Card.Root class="xl:col-span-12">
		<Card.Header>
			<div class="flex items-center justify-between">
				<Card.Title class="leading-none">Performance Overview</Card.Title>
			</div>
			<Card.Description>Response times and resolution rates over the last 7 days</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div class="lg:col-span-8">
					<ChartContainer config={chartConfig} class="h-72 w-full">
						<BarChart {data} x="day" y="minutes" />
						<ChartTooltip />
					</ChartContainer>
				</div>

				<div class="flex flex-col gap-5 rounded-lg p-4 lg:col-span-4">
					<div class="flex flex-col gap-1">
						<div class="text-4xl leading-none font-medium tabular-nums">
							4.8 <span class="text-lg font-normal text-muted-foreground">/ 5.0</span>
						</div>
						<p class="text-sm text-muted-foreground">
							Average reporter satisfaction based on recent reviews.
						</p>
					</div>

					<div class="flex flex-col gap-3 rounded-lg border border-border/60 p-3">
						<div class="text-[11px] tracking-widest text-muted-foreground uppercase">
							Resolution Rate
						</div>

						<div class="flex flex-col gap-1.5">
							<div class="text-2xl leading-none font-medium tabular-nums">
								{resolvedReports}
								<span class="text-sm font-normal text-muted-foreground">resolved</span>
							</div>
							<p class="text-sm text-muted-foreground">
								{resolveRate}% of tickets were resolved successfully.
							</p>
						</div>

						<div class="flex flex-col gap-2 pt-0.5">
							<div class="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
								<div class="h-full bg-primary" style="width: {resolveRate}%"></div>
							</div>
							<div class="flex items-center justify-between text-xs">
								<div class="font-medium tabular-nums">{resolvedReports} booked</div>
								<div class="text-muted-foreground tabular-nums">{totalReports} qualified</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
