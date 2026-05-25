<script lang="ts">
	import Heading from '$lib/components/shared/heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import type { Agent } from '$lib/features/agents/types';
	import AgentsTable from '$lib/features/agents/components/agents-table.svelte';
	import AgentForm from '$lib/features/agents/components/agent-form.svelte';

	let { data }: { data: PageData } = $props();

	let editingAgent: Agent | null = $state(null);
	let dialogOpen = $state(false);

	function openCreate() {
		editingAgent = null;
		dialogOpen = true;
	}

	function openEdit(agent: Agent) {
		editingAgent = agent;
		dialogOpen = true;
	}

	function closeDialog() {
		dialogOpen = false;
		editingAgent = null;
	}
</script>

<svelte:head>
	<title>Agents</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
	<div class="flex w-full items-center justify-between">
		<Heading title="Agents" description="Manage system agents who handle and respond to tickets." />
		<Button onclick={openCreate}>
			<PlusIcon />
			Add Agent
		</Button>
	</div>

	<AgentsTable agents={data.agents} onEdit={openEdit} />
</div>

<AgentForm bind:dialogOpen bind:editingAgent onClose={closeDialog} />
