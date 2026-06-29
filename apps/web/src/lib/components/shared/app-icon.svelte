<script lang="ts">
	import logoLight from '$lib/assets/icon-light.svg';
	import logoDark from '$lib/assets/icon-dark.svg';

	const { alt = 'Trak Logo', size = 'size-8' } = $props();
</script>

<div class="{size} shrink-0 overflow-hidden rounded-md">
	<img src={logoLight} {alt} class="h-full w-full object-contain dark:hidden" />
	<img src={logoDark} {alt} class="hidden h-full w-full object-contain dark:block" />
</div>
