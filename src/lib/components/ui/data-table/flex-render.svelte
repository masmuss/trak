<script
	lang="ts"
	generics="TData, TValue, TContext extends HeaderContext<TData, TValue> | CellContext<TData, TValue>"
>
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import type { CellContext, ColumnDefTemplate, HeaderContext } from '@tanstack/table-core';
	import type { Attachment } from 'svelte/attachments';
	type Props = {
		/** The cell or header field of the current cell's column definition. */
		content?: TContext extends HeaderContext<TData, TValue>
			? ColumnDefTemplate<HeaderContext<TData, TValue>>
			: TContext extends CellContext<TData, TValue>
				? ColumnDefTemplate<CellContext<TData, TValue>>
				: never;
		/** The result of the `getContext()` function of the header or cell */
		context: TContext;

		/** Used to pass attachments that can't be gotten through context */
		attach?: Attachment;
	};

	let { content, context, attach }: Props = $props();
</script>

{#if typeof content === 'string'}
	{content}
{:else if content instanceof Function}
	<!-- It's unlikely that a CellContext will be passed to a Header -->
	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
	{@const result = content(context as any)}
	{#if result && typeof result === 'object' && 'component' in result}
		{@const { component: Component, props } = result as any}
		<Component {...props} {attach} />
	{:else if result && typeof result === 'object' && 'snippet' in result}
		{@const { snippet, params } = result as any}
		{@render snippet({ ...params, attach })}
	{:else}
		{result}
	{/if}
{/if}
