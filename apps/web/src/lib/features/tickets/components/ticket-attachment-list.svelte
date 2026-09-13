<script lang="ts">
	import type { Attachment as AttachmentType } from '@trak/shared';
	import { FileIcon, PaperclipIcon } from 'phosphor-svelte';
	import * as Attachment from '$lib/components/ui/attachment';
	import { getAttachmentName } from '../utils/formatters';

	let {
		attachments = [],
		class: className = '',
		itemClass = ''
	}: {
		attachments: AttachmentType[];
		class?: string;
		itemClass?: string;
	} = $props();
</script>

{#if attachments.length > 0}
	<Attachment.Group class={className}>
		{#each attachments as attachment (attachment.id)}
			<Attachment.Root
				size="sm"
				class={itemClass}
				aria-label={`Open attachment ${attachment.fileType}`}
			>
				<Attachment.Media><FileIcon class="size-4" /></Attachment.Media>
				<Attachment.Content>
					<Attachment.Title class="truncate">
						{getAttachmentName(attachment.fileId, attachment.fileType)}
					</Attachment.Title>
					<Attachment.Description>Open attachment</Attachment.Description>
				</Attachment.Content>
				<Attachment.Actions>
					<Attachment.Action
						href={`/attachments/${attachment.id}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Open attachment"
					>
						<PaperclipIcon class="size-3" />
					</Attachment.Action>
				</Attachment.Actions>
			</Attachment.Root>
		{/each}
	</Attachment.Group>
{/if}
