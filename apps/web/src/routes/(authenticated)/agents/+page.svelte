<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'phosphor-svelte';
	import type { PageData } from './$types';
	import type { User as Agent } from '@trak/shared';
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

<div class="@container/main flex flex-col gap-4 md:gap-6">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between border-b">
			<div>
				<Card.Title>Agents</Card.Title>
				<Card.Description>Manage system agents who handle and respond to tickets.</Card.Description>
			</div>
			<Card.Action>
				<Button onclick={openCreate} size="sm">
					<PlusIcon />
					Add Agent
				</Button>
			</Card.Action>
		</Card.Header>
		<Card.Content>
			<AgentsTable agents={data.agents} onEdit={openEdit} />
		</Card.Content>
	</Card.Root>
</div>

<AgentForm bind:dialogOpen bind:editingAgent onClose={closeDialog} />
