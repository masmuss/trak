<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { SunIcon, MoonIcon, DesktopIcon } from 'phosphor-svelte';
	import { setMode, userPrefersMode } from 'mode-watcher';

	type ThemeMode = 'light' | 'dark' | 'system';
	const THEME_CYCLE: ThemeMode[] = ['light', 'dark', 'system'];

	function cycleTheme() {
		const currentMode = userPrefersMode.current ?? 'system';
		const currentIndex = THEME_CYCLE.indexOf(currentMode);
		const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
		setMode(nextTheme);
	}
</script>

<Button
	size="icon"
	variant="ghost"
	onclick={cycleTheme}
	aria-label={`Current theme: ${userPrefersMode.current}. Click to cycle themes.`}
	class="size-8"
>
	{#if userPrefersMode.current === 'system' || userPrefersMode.current === undefined}
		<DesktopIcon class="size-4" />
	{:else if userPrefersMode.current === 'dark'}
		<MoonIcon class="size-4" />
	{:else}
		<SunIcon class="size-4" />
	{/if}
</Button>
