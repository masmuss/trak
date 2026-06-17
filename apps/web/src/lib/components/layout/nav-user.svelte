<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { CaretUpDownIcon, SignOutIcon, GearSixIcon, SmileyIcon } from 'phosphor-svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import getInitials from '$lib/utils/initials';

	let { user }: { user: { name: string; email: string; image?: string | null } } = $props();
	const sidebar = useSidebar();

	const initials = $derived(getInitials(user.name));

	async function handleLogout() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto(resolve('/login'));
				}
			}
		});
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8">
							<Avatar.Image src={user.image ?? undefined} alt={user.name} />
							<Avatar.Fallback>{initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<CaretUpDownIcon class="ms-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center justify-between gap-2 px-1 py-1.5 text-start text-sm">
						<div class="flex items-center gap-2">
							<Avatar.Root class="size-8">
								<Avatar.Image src={user.image ?? undefined} alt={user.name} />
								<Avatar.Fallback>{initials}</Avatar.Fallback>
							</Avatar.Root>
							<div class="grid flex-1 text-start text-sm leading-tight">
								<span class="truncate font-semibold">{user.name}</span>
								<span class="truncate text-xs text-muted-foreground">{user.email}</span>
							</div>
						</div>
						<a
							href="##"
							class="p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
							aria-label="Settings"
						>
							<GearSixIcon class="size-4" />
						</a>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="flex items-center justify-between">
					<span>Feedback</span>
					<SmileyIcon class="size-4 text-muted-foreground" />
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onSelect={handleLogout}>
					<SignOutIcon />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
