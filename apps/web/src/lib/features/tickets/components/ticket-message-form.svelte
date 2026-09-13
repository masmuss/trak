<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { handleFormError } from '$lib/utils/form';
	import type { TicketDetails } from '@trak/shared';

	let { ticket }: { ticket: TicketDetails } = $props();
	let message = $state('');
	let visibility = $state<'public' | 'internal'>('public');

	const sendMessage: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) return;
			if (result.type === 'success') {
				message = '';
				toast.success(visibility === 'public' ? 'Reply sent' : 'Internal note added');
				await update();
			}
		};
	};
</script>

{#if ticket.status === 'closed'}
	<div
		class="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground"
	>
		This conversation is closed. Reopen the ticket to send a message.
	</div>
{:else}
	<form
		method="POST"
		action="?/sendMessage"
		enctype="multipart/form-data"
		use:enhance={sendMessage}
		class="space-y-3"
	>
		<Textarea
			name="body"
			bind:value={message}
			placeholder={visibility === 'public'
				? 'Write a reply to the reporter...'
				: 'Write an internal note...'}
			class="min-h-24"
			maxlength={5000}
		/>
		<Input
			name="attachments"
			type="file"
			multiple
			accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
		/>
		<div class="flex items-center justify-between gap-3">
			<label class="flex items-center gap-2 text-sm text-muted-foreground">
				<span>Message type</span>
				<Select.Root type="single" bind:value={visibility}>
					<Select.Trigger class="w-44">
						{visibility === 'public' ? 'Public reply' : 'Internal note'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="public">Public reply</Select.Item>
						<Select.Item value="internal">Internal note</Select.Item>
					</Select.Content>
				</Select.Root>
				<input type="hidden" name="visibility" value={visibility} />
			</label>
			<Button type="submit">Send message</Button>
		</div>
	</form>
{/if}
