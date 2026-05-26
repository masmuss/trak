<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { handleFormError } from '$lib/utils/form';

	let {
		open = $bindable(false),
		title,
		description = 'This action cannot be undone. This item will be permanently deleted.',
		action,
		id,
		successMessage = 'Deleted successfully'
	}: {
		open: boolean;
		title: string;
		description?: string;
		action: string;
		id: string;
		successMessage?: string;
	} = $props();

	const deleteEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (handleFormError(result)) {
				open = false;
				return;
			}

			if (result.type === 'success') {
				toast.success(successMessage);
				await update();
			}
			open = false;
		};
	};
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" {action} use:enhance={deleteEnhance}>
			<input type="hidden" name="id" value={id} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action type="submit" variant="destructive">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
