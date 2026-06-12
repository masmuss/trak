<script lang="ts">
	import { CloudArrowDownIcon } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { ExportFormat } from '../types';

	let {
		exportUrl,
		formats = ['csv'],
		filename = 'export'
	}: {
		exportUrl: string;
		formats?: ExportFormat[];
		filename?: string;
	} = $props();

	function handleExport(format: ExportFormat) {
		const url = new URL(exportUrl, window.location.origin);
		url.searchParams.set('format', format);

		const link = document.createElement('a');
		link.href = url.toString();
		link.download = `${filename}.${format}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

{#if formats.length === 1}
	<Button variant="outline" size="sm" class="h-8" onclick={() => handleExport(formats[0])}>
		<CloudArrowDownIcon />
		Export
	</Button>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="sm" class="h-8">
					<CloudArrowDownIcon />
					Export
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			{#each formats as format (format)}
				<DropdownMenu.Item onclick={() => handleExport(format)}>
					Export as {format.toUpperCase()}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
