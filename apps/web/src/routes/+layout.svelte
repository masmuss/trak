<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="icon" type="image/x-icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
	<meta property="og:title" content="trak" />
	<meta property="og:description" content="Ticket tracking system with Telegram bot integration" />
</svelte:head>

<Toaster />
<ModeWatcher />
{@render children()}
