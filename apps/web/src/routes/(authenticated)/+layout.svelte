<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button';
	import { GithubLogo } from 'phosphor-svelte';
	import ThemeSwitcher from '$lib/components/layout/theme-switcher.svelte';
	import CommandPalette from '$lib/components/layout/command-palette.svelte';
	import { MagnifyingGlassIcon } from 'phosphor-svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { BellIcon } from 'phosphor-svelte';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { getAgentNotificationTypeLabel } from '@trak/shared';
	import { formatRelativeTime } from '$lib/utils/date';

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

	let paletteOpen = $state(false);

	$effect(() => {
		const events = new EventSource('/tickets/events');
		events.addEventListener('agent-notification', () => void invalidateAll());
		return () => events.close();
	});

	async function openNotification(event: MouseEvent, notificationId: string, reportId: string) {
		event.preventDefault();
		const response = await fetch(`/notifications/${notificationId}/read`, { method: 'POST' });
		if (!response.ok) {
			throw new Error('Unable to mark notification as read');
		}
		await invalidateAll();
		await goto(resolve('/(authenticated)/tickets/[id]', { id: reportId }));
	}

	async function markAllNotificationsRead() {
		const response = await fetch('/notifications/read-all', { method: 'POST' });
		if (!response.ok) {
			throw new Error('Unable to mark all notifications as read');
		}
		await invalidateAll();
	}
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
					<Button
						variant="ghost"
						size="sm"
						class="hidden gap-2 text-muted-foreground md:flex"
						onclick={() => (paletteOpen = true)}
						aria-label="Search tickets and navigation"
					>
						<MagnifyingGlassIcon class="size-4" />
						<span class="text-xs">Search...</span>
						<kbd
							class="pointer-events-none rounded border bg-muted px-1 font-mono text-[10px] font-medium"
						>
							⌘K
						</kbd>
					</Button>
					<Popover.Root>
						<Popover.Trigger>
							<Button variant="ghost" size="icon" class="relative" aria-label="Notifications">
								<BellIcon class="size-4" />
								{#if page.data.unreadNotificationCount}
									<span
										class="text-destructive-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px]"
									>
										{page.data.unreadNotificationCount}
									</span>
								{/if}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-80">
							<div class="flex items-center justify-between">
								<Popover.Title>Notifications</Popover.Title>
								{#if page.data.unreadNotificationCount}
									<Button variant="ghost" size="sm" onclick={markAllNotificationsRead}>
										Mark all read
									</Button>
								{/if}
							</div>
							<div class="mt-3 space-y-2">
								{#if page.data.notifications?.length}
									{#each page.data.notifications as notification (notification.id)}
										<a
											href={resolve('/(authenticated)/tickets/[id]', {
												id: notification.reportId
											})}
											onclick={(event) =>
												openNotification(event, notification.id, notification.reportId)}
											class="block rounded-md p-2 text-sm hover:bg-muted"
										>
											<span class="mb-1 flex items-center justify-between gap-2">
												<span class="text-xs font-medium text-muted-foreground">
													{getAgentNotificationTypeLabel(notification.type)}
												</span>
												<span class="text-xs text-muted-foreground">
													{formatRelativeTime(notification.createdAt)}
												</span>
											</span>
											{notification.message}
										</a>
									{/each}
								{:else}
									<p class="text-sm text-muted-foreground">No notifications</p>
								{/if}
							</div>
						</Popover.Content>
					</Popover.Root>
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
<CommandPalette bind:open={paletteOpen} />
