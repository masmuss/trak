<script lang="ts">
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button';
	import { GithubLogo } from 'phosphor-svelte';
	import ThemeSwitcher from '$lib/components/layout/theme-switcher.svelte';

	const autoBreadcrumbs = $derived.by(() => {
		if (page.data.breadcrumbs) {
			return page.data.breadcrumbs;
		}

		const paths = page.url.pathname.split('/').filter(Boolean);
		return paths.map((path, index) => {
			const href = '/' + paths.slice(0, index + 1).join('/');
			const label = path.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

			const isLast = index === paths.length - 1;

			return { label, href: isLast ? undefined : href };
		});
	});

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="min-w-0 overflow-x-hidden peer-data-[variant=inset]:border">
		<header
			class="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex w-full items-center justify-between px-4 lg:px-6">
				<div class="flex items-center gap-1 lg:gap-2">
					<Sidebar.Trigger class="-ms-1" />
					<Separator
						orientation="vertical"
						class="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
					/>
					<Breadcrumb.Root>
						<Breadcrumb.List>
							{#each autoBreadcrumbs as crumb, i (crumb.label)}
								<Breadcrumb.Item class={i < autoBreadcrumbs.length - 1 ? 'hidden md:block' : ''}>
									{#if crumb.href}
										<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
									{:else}
										<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
									{/if}
								</Breadcrumb.Item>
								{#if i < autoBreadcrumbs.length - 1}
									<Breadcrumb.Separator class="hidden md:block" />
								{/if}
							{/each}
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>
				<div class="flex items-center gap-2">
					<ThemeSwitcher />
					<Button
						variant="ghost"
						size="icon"
						href="https://github.com/masmuss/trak"
						target="_blank"
						rel="noreferrer"
						aria-label="Open GitHub repository"
					>
						<GithubLogo class="size-4" />
					</Button>
				</div>
			</div>
		</header>
		<div class="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 md:p-6">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
