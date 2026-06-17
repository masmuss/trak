<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import { CaretRightIcon } from 'phosphor-svelte';

	type NavItem = {
		title: string;
		url: string;
		icon?: import('svelte').Component;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	};

	let {
		groups
	}: {
		groups: {
			id: string;
			label?: string;
			items: NavItem[];
		}[];
	} = $props();
</script>

{#each groups as group (group.id)}
	<Sidebar.Group>
		{#if group.label}
			<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
		{/if}
		<Sidebar.Menu>
			{#each group.items as item (item.title)}
				{#if item.items && item.items.length > 0}
					<Collapsible.Root open={item.isActive} class="group/collapsible">
						{#snippet child({ props })}
							<Sidebar.MenuItem {...props}>
								<Collapsible.Trigger>
									{#snippet child({ props })}
										<Sidebar.MenuButton {...props} tooltipContent={item.title}>
											{#if item.icon}
												<item.icon />
											{/if}
											<span>{item.title}</span>
											<CaretRightIcon
												class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
											/>
										</Sidebar.MenuButton>
									{/snippet}
								</Collapsible.Trigger>
								<Collapsible.Content>
									<Sidebar.MenuSub>
										{#each item.items as subItem (subItem.title)}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton>
													{#snippet child({ props })}
														<!-- eslint-disable svelte/no-navigation-without-resolve -->
														<a href={subItem.url} {...props}>
															<span>{subItem.title}</span>
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								</Collapsible.Content>
							</Sidebar.MenuItem>
						{/snippet}
					</Collapsible.Root>
				{:else}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton tooltipContent={item.title} isActive={item.isActive}>
							{#snippet child({ props })}
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a href={item.url} {...props}>
									{#if item.icon}
										<item.icon />
									{/if}
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/if}
			{/each}
		</Sidebar.Menu>
	</Sidebar.Group>
{/each}
