<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { dev } from '$app/environment';

	let { children } = $props();

	const origin = dev ? 'http://localhost:5173' : 'https://trak.app';
	const ogImage = `${origin}/logo/og-image.svg`;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
	<meta property="og:title" content="trak" />
	<meta property="og:description" content="Ticket tracking system with Telegram bot integration" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="trak" />
	<meta name="twitter:description" content="Ticket tracking system with Telegram bot integration" />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<Toaster />
<ModeWatcher />
{@render children()}
