<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';

	import { PlusCircleIcon } from 'phosphor-svelte';
	import type { SelectFilterConfig } from '../types';

	let {
		title,
		config,
		selectedValues = new Set<string>(),
		onSelect,
		onClear
	}: {
		title: string;
		config: SelectFilterConfig;
		selectedValues?: Set<string>;
		onSelect?: (value: string) => void;
		onClear?: () => void;
	} = $props();

	const options = $derived(config.options || []);
	const selectedCount = $derived(selectedValues.size);
	const isMultiSelect = $derived(config.type === 'multi-select');
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<PlusCircleIcon />
				{title}
				{#if selectedCount > 0}
					<Separator orientation="vertical" class="mx-2" />
					<Badge variant="secondary" class="ml-3 font-normal lg:hidden">
						{selectedCount}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						{#if selectedCount > 2}
							<Badge variant="secondary">
								{selectedCount} selected
							</Badge>
						{:else}
							{#each options.filter( (opt) => selectedValues.has(String(opt.value)) ) as option (option.value)}
								<Badge variant="secondary">
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-50 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						{@const isSelected = selectedValues.has(String(option.value))}
						<Command.Item onSelect={() => onSelect?.(String(option.value))}>
							{#if isMultiSelect}
								<Checkbox checked={isSelected} class="pointer-events-none me-2" />
							{:else}
								{@const CheckIcon = isSelected ? '✓' : ''}
								<span class="me-2 text-muted-foreground">{CheckIcon}</span>
							{/if}
							{#if option.icon}
								{@const Icon = option.icon}
								<Icon class="text-muted-foreground" />
							{/if}
							<span>{option.label}</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedCount > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item onSelect={() => onClear?.()} class="justify-center text-center">
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
