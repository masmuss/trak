import { toast } from 'svelte-sonner';
import type { ActionResult } from '@sveltejs/kit';

/**
 * Shared utility to handle form errors/failures from SvelteKit ActionResult.
 * Returns true if the result was an error or failure, false otherwise.
 */
export function handleFormError(result: ActionResult): boolean {
	if (result.type === 'error') {
		toast.error(result.error?.message ?? 'Something went wrong');
		return true;
	}
	if (result.type === 'failure') {
		toast.error((result.data?.error as string) ?? 'Invalid submission');
		return true;
	}
	return false;
}
